export const WALLET_CONNECT_CONFIG = {
  mockTokenAddress: '0xba89d4B0513eAdA62671f5db8D6Fef498Ff63331',
  grantPlatformImplementationAddress:
    '0x16F6583595A0935270187c15701861af5281974c',
  grantPlatformProxyAddress: '0x1e7f5f6Bd0F2D03A6eA77B467C722Be7c53f5452',
} as const;

export const getGrantPlatformProxyAddress = () =>
  import.meta.env.VITE_GRANT_PLATFORM_PROXY_ADDRESS ||
  WALLET_CONNECT_CONFIG.grantPlatformProxyAddress;
