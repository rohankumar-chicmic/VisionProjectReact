import { BrowserProvider, isAddress, Contract, Eip1193Provider } from 'ethers';
import { getGrantPlatformProxyAddress, WALLET_CONNECT_CONFIG } from './config';
import GrantPlatformArtifact from '../../../GrantPlatform.json';

export interface GrantPlatformTransactionResult {
  transactionHash: string;
  walletAddress: string;
}

const getEthereumObject = () => {
  const { ethereum } = window as unknown as { ethereum: Eip1193Provider };

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
  'function decimals() public view returns (uint8)',
];

export const createGrantPlatformTransaction = async (
  totalAmount: number = 0
): Promise<GrantPlatformTransactionResult> => {
  const proxyAddress = getGrantPlatformProxyAddress();
  const { mockTokenAddress } = WALLET_CONNECT_CONFIG;

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

  const ethereum = getEthereumObject();

  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  const provider = new BrowserProvider(ethereum);
  await provider.send('eth_requestAccounts', []);

  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();

  // 1. Token Approval Step
  if (totalAmount > 0) {
    const tokenContract = new Contract(mockTokenAddress, ERC20_ABI, signer);

    // Fetch decimals dynamically from the contract to ensure accuracy
    const tokenDecimals = await tokenContract.decimals();

    // Scale the amount correctly based on the token's decimals
    // Using a simple multiplier for clarity, but ensuring BigInt conversion
    const multiplier = 10n ** BigInt(tokenDecimals);
    const amountToApprove = BigInt(Math.floor(totalAmount)) * multiplier;

    const approveTx = await tokenContract.approve(
      proxyAddress,
      amountToApprove
    );
    await approveTx.wait();
  }

  // 2. Platform Transaction Step

  // Use the implementation ABI to call a valid function on the proxy.
  // This ensures the transaction doesn't revert during gas estimation.
  const platformContract = new Contract(
    proxyAddress,
    GrantPlatformArtifact.abi,
    signer
  );

  // We use populateTransaction and sendTransaction to ensure it's sent as a
  // live transaction even if it's a 'view' function, to get a hash for the backend.
  const txData =
    await platformContract.UPGRADE_INTERFACE_VERSION.populateTransaction();
  const transaction = await signer.sendTransaction(txData);

  await transaction.wait();

  return {
    transactionHash: transaction.hash,
    walletAddress,
  };
};
