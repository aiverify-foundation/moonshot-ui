import { useRef } from 'react';

// Check for touch capability and screen size characteristics typical of tablets
const isTablet = () => {
  if (typeof window === 'undefined') return false;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  // Check for tablet-specific pointer capabilities
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  return hasTouch && hasCoarsePointer;
};

export function useIsTabletDevice() {
  const isTabletDevice = useRef<boolean>(isTablet());
  return isTabletDevice.current;
}
