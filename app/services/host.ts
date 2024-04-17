export function getHostAndPort(): [string, string] {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    return [`${protocol}//${hostname}`, port];
  }
  return ['http://localhost', '3000'];
}
