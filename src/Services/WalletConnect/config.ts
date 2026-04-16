export const WALLET_CONNECT_CONFIG = {
  mockTokenAddress: '0x439BAb107F0b073AecdbC9fb171b96589c4505FD',
  grantPlatformImplementationAddress:
    '0x5ED71c57139FfBCA13cA93b836fa287f867Dad0F',
  grantPlatformProxyAddress: '0xAC103BAfC064e9b7F52Af284F915aabDc4E5A8f9',
  treasuryAddress: '0xE6d4cf7e6f936d1676148eaC4D52D3844cA7a6ae',
  escrowAddress: '0x5cbE708c094986d96CAc7A5df8aF81e35ABBf652',
} as const;

export const getGrantPlatformProxyAddress = () =>
  WALLET_CONNECT_CONFIG.grantPlatformProxyAddress;

export const getEscrowAddress = () => WALLET_CONNECT_CONFIG.escrowAddress;

export const getUsdcAddress = () => WALLET_CONNECT_CONFIG.mockTokenAddress;

export const getTreasuryAddress = () => WALLET_CONNECT_CONFIG.treasuryAddress;
