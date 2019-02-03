const CONFIG_TYPE_CLIENT = 'client';
const CONFIG_TYPE_SSR = 'ssr';

const isClient = type => type === CONFIG_TYPE_CLIENT;
const isSSR = type => type === CONFIG_TYPE_SSR;

module.exports = {
  CONFIG_TYPE_CLIENT,
  CONFIG_TYPE_SSR,
  isClient,
  isSSR,
};
