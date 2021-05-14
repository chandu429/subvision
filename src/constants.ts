type Network = 'polkadot' | 'kusama' | 'rococo';

const { STAGE, NODE_ENV } = process.env;
const isProd = NODE_ENV?.startsWith('prod');

interface Config {
  leasePeriod: number;
  decimal: number;
  tokenSymbol: string;
  endpoint: string;
}

export const NetworkConfigs: Record<Network, Config> = {
  polkadot: {
    leasePeriod: 259200,
    decimal: 10,
    tokenSymbol: 'DOT',
    endpoint: ''
  },
  kusama: {
    leasePeriod: 129600,
    decimal: 12,
    tokenSymbol: 'KSM',
    endpoint: 'https://api.subquery.network/sq/subvis-io/kusama-auction'
  },
  rococo: {
    leasePeriod: 14400,
    decimal: 12,
    tokenSymbol: 'ROC',
    endpoint: 'https://api.subquery.network/sq/subvis-io/rococo-auction'
  }
};

export const config: Config = {
  ...NetworkConfigs[STAGE || 'rococo'],
  ...(!isProd && { endpoint: 'http://localhost:3000' })
};
