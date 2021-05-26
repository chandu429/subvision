type Network = 'polkadot' | 'kusama' | 'rococo';

const { STAGE, NODE_ENV } = process.env;
const isProd = NODE_ENV?.startsWith('prod');

interface Config {
  leasePeriod: number;
  leasesPerSlot: number;
  decimal: number;
  tokenSymbol: string;
  endpoint: string;
  paraMappingUrl: string;
  defaultParachainIcon: string;
}

export const NetworkConfigs: Record<Network, Config> = {
  polkadot: {
    leasePeriod: 2419200,
    leasesPerSlot: 3,
    decimal: 10,
    tokenSymbol: 'DOT',
    endpoint: '',
    paraMappingUrl: 'https://raw.githubusercontent.com/soramitsu/fearless-utils/master/crowdloan/polkadot.json',
    defaultParachainIcon: './ksm-logo.svg'
  },
  kusama: {
    leasePeriod: 604800,
    leasesPerSlot: 7,
    decimal: 12,
    tokenSymbol: 'KSM',
    endpoint: 'https://api.subquery.network/sq/subvis-io/kusama-auction',
    paraMappingUrl: 'https://raw.githubusercontent.com/soramitsu/fearless-utils/master/crowdloan/kusama.json',
    defaultParachainIcon: './ksm-logo.svg'
  },
  rococo: {
    leasePeriod: 14400,
    leasesPerSlot: 7,
    decimal: 12,
    tokenSymbol: 'ROC',
    endpoint: 'https://api.subquery.network/sq/subvis-io/rococo-auction',
    paraMappingUrl: 'https://raw.githubusercontent.com/soramitsu/fearless-utils/master/crowdloan/rococo.json',
    defaultParachainIcon: './ksm-logo.svg'
  }
};

export const config: Config = {
  ...NetworkConfigs[STAGE || 'rococo'],
  ...(!isProd && { endpoint: 'http://localhost:3000' })
};
