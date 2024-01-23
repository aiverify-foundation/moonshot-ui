export function throttle(func: (...args: any[]) => void, delay: number) {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

export function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;
  return function (...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
