const host = window.location.hostname;
const prot = window.location.protocol;

export const environment = {
  production: true,
  apiUrl: `${prot}//${host}/api/`,
  imageUrl: `${prot}//${host}/static/`,
  wsUrl: `${prot}//${host}`,
  wsPath: '/ws'
};
