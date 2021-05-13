type Network = 'polkadot' | 'kusama' | 'rococo';

interface Config {
  leasePeriod: number;
  decimal: number;
  tokenSymbol: string;
}

export const NetworkConfigs: Record<Network, Config> = {
  polkadot: {
    leasePeriod: 259200,
    decimal: 10,
    tokenSymbol: 'DOT'
  },
  kusama: {
    leasePeriod: 129600,
    decimal: 12,
    tokenSymbol: 'KSM'
  },
  rococo: {
    leasePeriod: 14400,
    decimal: 12,
    tokenSymbol: 'ROC'
  }
};

export const config: Config = {
  ...NetworkConfigs[process.env.STAGE || 'rococo']
};
