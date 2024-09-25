export function isWebkit() {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    /webkit/.test(userAgent) && !/chrome|crios|crmo|android/.test(userAgent)
  );
}
