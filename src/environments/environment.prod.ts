const host = window.location.hostname;
const prot = window.location.protocol;
const port = window.location.port;

export const environment = {
  production: true,
  apiUrl: `${prot}//${host}:${port}/api/`,
  imageUrl: `${prot}//${host}:${port}/static/`,
  backendUrl: `${prot}//${host}/`
};
