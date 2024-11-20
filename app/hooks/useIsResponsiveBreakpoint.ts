export function useIsResponsiveBreakpoint() {
  if (typeof window === 'undefined') return 'others';
  if (window.matchMedia('(min-width: 1371px)').matches) {
    return 'lg';
  }

  if (
    window.matchMedia('(min-width: 1195px) and (max-width: 1370px)').matches
  ) {
    return 'md';
  }

  if (window.matchMedia('(max-width: 1194px)').matches) {
    return 'sm';
  }

  return 'others';
}
