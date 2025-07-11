const host = window.location.hostname;
const prot = window.location.protocol;
const port = window.location.port ? `:${window.location.port}` : '';

export const environment = {
  production: false,
  apiUrl: `${prot}//${host}${port}/api/`,
  imageUrl: `${prot}//${host}${port}/static/`,
  wsUrl: `${prot}//${host}${port}`,
  wsPath: '/ws'
};
