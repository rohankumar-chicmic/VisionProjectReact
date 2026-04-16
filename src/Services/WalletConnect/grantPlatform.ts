/**
 * GrantPlatform Frontend Blockchain Integration
 *
 * All state-changing calls go through the GrantPlatformProxy address.
 * USDC amounts use 6 decimal places (e.g. 5 USDC = 5_000_000).
 *
 * APPROVAL CHEAT SHEET:
 *   subscribe    → USDC.approve(GrantPlatformProxy, planFee)
 *   applyForGala → USDC.approve(TicketEscrow, ticketPrice)   ← different spender!
 *   publishGala  → done server-side (backend handles USDC approval + publishGala call)
 *   deleteGala   → no approval needed, frontend calls directly
 */

import {
  BrowserProvider,
  Contract,
  isAddress,
  Eip1193Provider,
  parseUnits,
  keccak256,
  toUtf8Bytes,
} from 'ethers';
import {
  getGrantPlatformProxyAddress,
  getEscrowAddress,
  getUsdcAddress,
} from './config';
import GrantPlatformArtifact from '../../../GrantPlatform.json';

// ─── Shared Types ────────────────────────────────────────────────────────────

export interface WalletTxResult {
  transactionHash: string;
  walletAddress: string;
}

export interface SubscriptionDetails {
  planId: string;
  autopay: boolean;
  expiresAt: bigint;
  active: boolean;
}

// ─── Shared ABIs ─────────────────────────────────────────────────────────────

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function decimals() public view returns (uint8)',
] as const;

const ESCROW_ABI = [
  'function claimRefund(bytes32 galaId) external',
  'function withdrawRevenue(bytes32 galaId) external',
] as const;

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/** Returns the raw window.ethereum provider, throwing if not found. */
const getEthereum = (): Eip1193Provider => {
  const { ethereum } = globalThis as unknown as { ethereum?: Eip1193Provider };
  if (!ethereum) {
    throw new Error(
      'No wallet detected. Please install MetaMask and try again.'
    );
  }
  return ethereum;
};

/**
 * Automatically prompts the user to switch to Polygon Amoy (80002).
 * If the network isn't in their wallet, it prompts to add it.
 */
const ensureAmoyNetwork = async (ethereum: Eip1193Provider) => {
  const chainIdHex = '0x13882'; // 80002 in hex
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError: unknown) {
    // Error code 4902 means the chain hasn't been added to MetaMask
    if ((switchError as { code?: number }).code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainIdHex,
            chainName: 'Polygon Amoy Testnet',
            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
            rpcUrls: ['https://rpc-amoy.polygon.technology'],
            blockExplorerUrls: ['https://amoy.polygonscan.com'],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
};

/** Creates a BrowserProvider + requests account access, returns signer + address. */
const getSigner = async () => {
  const ethereum = getEthereum();

  // Prompt network switch before connecting accounts
  await ensureAmoyNetwork(ethereum);

  const provider = new BrowserProvider(ethereum);
  // Request accounts
  const accounts = await provider.send('eth_requestAccounts', []);

  // Final verification check
  const network = await provider.getNetwork();
  if (network.chainId !== 80002n) {
    throw new Error(
      `Wrong network! Please switch MetaMask to Polygon Amoy (Chain ID: 80002).`
    );
  }

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts connected.');
  }
  const signer = await provider.getSigner();
  const walletAddress = (await signer.getAddress()).toLowerCase();
  return { provider, signer, walletAddress };
};

/**
 * Returns a Contract instance pointed at the GrantPlatformProxy,
 * using the implementation ABI (the proxy delegates to the impl).
 */
const getPlatformContract = (
  signer: Awaited<ReturnType<typeof getSigner>>['signer']
) => {
  const proxyAddress = getGrantPlatformProxyAddress();
  if (!isAddress(proxyAddress)) {
    throw new Error(`Invalid GrantPlatformProxy address: ${proxyAddress}`);
  }
  return new Contract(proxyAddress, GrantPlatformArtifact.abi, signer);
};

/**
 * Fetches current fee data and applies a boost to ensure transactions
 * meet Polygon Amoy's minimum gas requirements (25+ Gwei).
 */
const getGasOverrides = async (provider: BrowserProvider) => {
  const feeData = await provider.getFeeData();

  // Set a safe minimum priority fee (35 Gwei) to exceed network minimum (25 Gwei)
  const minPriorityFee = parseUnits('35', 'gwei');

  const maxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas &&
    feeData.maxPriorityFeePerGas > minPriorityFee
      ? feeData.maxPriorityFeePerGas
      : minPriorityFee;

  // Max fee should be at least base fee + priority fee
  const maxFeePerGas =
    feeData.maxFeePerGas && feeData.maxFeePerGas > maxPriorityFeePerGas
      ? feeData.maxFeePerGas
      : maxPriorityFeePerGas * 2n;

  return {
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
};

/**
 * Approves `spenderAddress` to spend `usdcAmount` (in units like 10.5 for 10.5 USDC)
 * from the connected wallet. Fetches token decimals dynamically.
 */
const approveUsdc = async (
  signer: Awaited<ReturnType<typeof getSigner>>['signer'],
  spenderAddress: string,
  usdcAmount: number,
  provider: BrowserProvider
): Promise<void> => {
  const tokenAddress = getUsdcAddress();
  if (!isAddress(tokenAddress))
    throw new Error(`Invalid USDC address: ${tokenAddress}`);

  const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
  const decimals: bigint = await tokenContract.decimals();
  const amountToApprove = parseUnits(usdcAmount.toString(), decimals);

  const overrides = await getGasOverrides(provider);
  const approveTx = await tokenContract.approve(
    spenderAddress,
    amountToApprove,
    overrides
  );
  await approveTx.wait();
};

// ─── FRONTEND-CALLED WRITE FUNCTIONS ─────────────────────────────────────────

/**
 * Deletes a gala on-chain (organiser only).
 */
export const deleteGalaOnChain = async (
  galaId: string
): Promise<WalletTxResult> => {
  const { signer, walletAddress, provider } = await getSigner();
  const platform = getPlatformContract(signer);
  const overrides = await getGasOverrides(provider);
  const tx = await platform.deleteGala(galaId, overrides);
  await tx.wait();
  return { transactionHash: tx.hash.toLowerCase(), walletAddress };
};

/**
 * Buys a ticket for a gala.
 */
export const applyForGalaOnChain = async (
  galaId: string,
  ticketPrice: number
): Promise<WalletTxResult> => {
  const { signer, walletAddress, provider } = await getSigner();
  const escrowAddress = getEscrowAddress();
  if (ticketPrice > 0) {
    await approveUsdc(signer, escrowAddress, ticketPrice, provider);
  }
  const platform = getPlatformContract(signer);
  const overrides = await getGasOverrides(provider);
  const tx = await platform.applyForGala(galaId, overrides);
  await tx.wait();
  return { transactionHash: tx.hash.toLowerCase(), walletAddress };
};

/**
 * Applies for a specific grant.
 */
export const applyForGrantOnChain = async (
  galaId: string,
  grantId: string
): Promise<WalletTxResult> => {
  const { signer, walletAddress, provider } = await getSigner();
  const platform = getPlatformContract(signer);
  const overrides = await getGasOverrides(provider);
  const tx = await platform.applyForGrant(
    galaId,
    grantId,
    walletAddress,
    overrides
  );
  await tx.wait();
  return { transactionHash: tx.hash.toLowerCase(), walletAddress };
};

/**
 * Subscribes to a plan.
 */
export const subscribeOnChain = async (
  planId: string,
  feeAmount: number
): Promise<WalletTxResult> => {
  const { signer, walletAddress, provider } = await getSigner();
  const proxyAddress = getGrantPlatformProxyAddress();
  if (feeAmount > 0) {
    await approveUsdc(signer, proxyAddress, feeAmount, provider);
  }
  const platform = getPlatformContract(signer);
  const overrides = await getGasOverrides(provider);
  const tx = await platform.subscribe(planId, overrides);
  await tx.wait();
  return { transactionHash: tx.hash.toLowerCase(), walletAddress };
};

/**
 * Cancels subscription.
 */
export const cancelSubscriptionOnChain = async (): Promise<WalletTxResult> => {
  const { signer, walletAddress, provider } = await getSigner();
  const platform = getPlatformContract(signer);
  const overrides = await getGasOverrides(provider);
  const tx = await platform.cancelSubscription(overrides);
  await tx.wait();
  return { transactionHash: tx.hash.toLowerCase(), walletAddress };
};

/**
 * Claims a ticket refund (user only).
 */
export const claimRefundOnChain = async (
  galaId: string
): Promise<WalletTxResult> => {
  const { signer, walletAddress, provider } = await getSigner();
  const escrowAddress = getEscrowAddress();
  const escrow = new Contract(escrowAddress, ESCROW_ABI, signer);
  const hashedId = keccak256(toUtf8Bytes(galaId));
  const overrides = await getGasOverrides(provider);
  const tx = await escrow.claimRefund(hashedId, overrides);
  await tx.wait();
  return { transactionHash: tx.hash.toLowerCase(), walletAddress };
};

/**
 * Withdraws gala revenue (organiser only).
 */
export const withdrawRevenueOnChain = async (
  galaId: string
): Promise<WalletTxResult> => {
  const { signer, walletAddress, provider } = await getSigner();
  const escrowAddress = getEscrowAddress();
  const escrow = new Contract(escrowAddress, ESCROW_ABI, signer);
  const hashedId = keccak256(toUtf8Bytes(galaId));
  const overrides = await getGasOverrides(provider);
  const tx = await escrow.withdrawRevenue(hashedId, overrides);
  await tx.wait();
  return { transactionHash: tx.hash.toLowerCase(), walletAddress };
};

/**
 * Prepares the mandatory USDC approval for backend publish.
 */
export const createGrantPlatformTransaction = async (
  totalAmount: number = 0
): Promise<WalletTxResult> => {
  const proxyAddress = getGrantPlatformProxyAddress();
  const tokenAddress = getUsdcAddress();
  if (!isAddress(proxyAddress)) throw new Error('Invalid Proxy Address');
  if (!isAddress(tokenAddress)) throw new Error('Invalid USDC Address');

  const { signer, walletAddress, provider } = await getSigner();

  // CONTRACT CHECK: Verify USDC address has code
  const code = await provider.getCode(tokenAddress);
  if (code === '0x') {
    throw new Error(
      `No contract found at USDC address ${tokenAddress}. Are you on the right network?`
    );
  }

  const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
  const decimals: bigint = await tokenContract.decimals();
  const amountToApprove = parseUnits(totalAmount.toString(), decimals);

  const overrides = await getGasOverrides(provider);
  const approveTx = await tokenContract.approve(
    proxyAddress,
    amountToApprove,
    overrides
  );
  await approveTx.wait();

  return { transactionHash: approveTx.hash.toLowerCase(), walletAddress };
};

// ─── READ-ONLY VIEW FUNCTIONS ────────────────────────────────────────────────

export const isSubscribedOnChain = async (
  userAddress: string
): Promise<boolean> => {
  const { signer } = await getSigner();
  const platform = getPlatformContract(signer);
  return platform.isSubscribed(userAddress);
};

export const checkTicketOnChain = async (
  galaId: string,
  userAddress: string
): Promise<boolean> => {
  const { signer } = await getSigner();
  const platform = getPlatformContract(signer);
  return platform.checkTicket(galaId, userAddress);
};

export const checkGrantApplicationOnChain = async (
  grantId: string,
  userAddress: string
): Promise<boolean> => {
  const { signer } = await getSigner();
  const platform = getPlatformContract(signer);
  return platform.checkGrantApplication(grantId, userAddress);
};

export const getUserSubscriptionDetails = async (
  userAddress: string
): Promise<SubscriptionDetails> => {
  const { signer } = await getSigner();
  const platform = getPlatformContract(signer);
  const result = await platform.userSubscriptionDetails(userAddress);
  return {
    planId: result.planId,
    autopay: result.autopay,
    expiresAt: result.expiresAt,
    active: result.active,
  };
};
