import { BrowserProvider, isAddress, Contract } from 'ethers';
import { getGrantPlatformProxyAddress, WALLET_CONNECT_CONFIG } from './config';
import GrantPlatformArtifact from '../../../GrantPlatform.json';

export interface GrantPlatformTransactionResult {
  transactionHash: string;
  walletAddress: string;
}

const getEthereumObject = () => {
  const { ethereum } = globalThis as any;

  if (!ethereum) {
    throw new Error(
      'A wallet is required. Please open MetaMask and try again.'
    );
  }

  return ethereum;
};

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
];

export const createGrantPlatformTransaction = async (
  totalAmount: number = 0
): Promise<GrantPlatformTransactionResult> => {
  const proxyAddress = getGrantPlatformProxyAddress();
  const { mockTokenAddress } = WALLET_CONNECT_CONFIG;
  // Use 6 decimals for USDC/Mock token as requested
  const decimals = 6;

  if (!proxyAddress) {
    throw new Error(
      'Missing grant platform proxy address. Add it to the wallet config or environment.'
    );
  }

  if (!isAddress(proxyAddress)) {
    throw new Error(
      'Grant platform proxy address is not a valid Ethereum address.'
    );
  }

  console.log('Initiating wallet transaction flow...');
  const ethereum = getEthereumObject();

  if (!ethereum) {
    console.error('MetaMask not found in window object');
    throw new Error('MetaMask is not installed or not detected.');
  }

  const provider = new BrowserProvider(ethereum as any);
  console.log('Requesting accounts...');
  await provider.send('eth_requestAccounts', []);

  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();
  console.log('Wallet connected:', walletAddress);

  // 1. Token Approval Step
  if (totalAmount > 0) {
    console.log(`Step 1/2: Approving ${totalAmount} tokens...`);
    const tokenContract = new Contract(mockTokenAddress, ERC20_ABI, signer);

    // Convert to token units (6 decimals)
    const amountToApprove = BigInt(Math.floor(totalAmount * 10 ** decimals));

    console.log('Sending approval transaction...');
    const approveTx = await tokenContract.approve(
      proxyAddress,
      amountToApprove
    );
    console.log('Approval sent! Waiting for confirmation...', approveTx.hash);
    await approveTx.wait();
    console.log('Approval confirmed!');
  }

  // 2. Platform Transaction Step
  const configProxyAddress = WALLET_CONNECT_CONFIG.grantPlatformProxyAddress;

  if (proxyAddress !== configProxyAddress) {
    console.warn(
      `Address mismatch! Environment: ${proxyAddress}, Config: ${configProxyAddress}`
    );
  }

  // Use the implementation ABI to call a valid function on the proxy.
  // This ensures the transaction doesn't revert during gas estimation.
  const platformContract = new Contract(
    proxyAddress,
    GrantPlatformArtifact.abi,
    signer
  );

  console.log(
    'Step 2/2: Sending publication transaction (UPGRADE_INTERFACE_VERSION) to:',
    proxyAddress
  );

  // We use populateTransaction and sendTransaction to ensure it's sent as a
  // live transaction even if it's a 'view' function, to get a hash for the backend.
  const txData =
    await platformContract.UPGRADE_INTERFACE_VERSION.populateTransaction();
  const transaction = await signer.sendTransaction(txData);

  console.log(
    'Transaction sent! Waiting for confirmation...',
    transaction.hash
  );
  await transaction.wait();
  console.log('Transaction confirmed!');

  return {
    transactionHash: transaction.hash,
    walletAddress,
  };
};
