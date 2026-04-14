export const WALLET_CONNECT_CONFIG = {
  mockTokenAddress: '0x274c6821487A5C2A64969037a8ae5256822BdD4D',
  grantPlatformImplementationAddress:
    '0x15903991e3f2C6Af72fe9f81aa37a4E8502E6145',
  grantPlatformProxyAddress: '0x127B0E32173aaEdA6dFbf4E3Df96D47Dd9d76103',
} as const;

export const getGrantPlatformProxyAddress = () =>
  import.meta.env.VITE_GRANT_PLATFORM_PROXY_ADDRESS ||
  WALLET_CONNECT_CONFIG.grantPlatformProxyAddress;
