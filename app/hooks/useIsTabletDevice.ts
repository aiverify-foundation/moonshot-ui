import { useRef } from 'react';

// Check for touch capability and screen size characteristics typical of tablets
const isTablet = () => {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  // Check screen dimensions - tablets typically between phone and desktop sizes
  const isTabletSize = window.matchMedia(
    '(min-width: 600px) and (max-width: 1200px)'
  ).matches;
  // Check for tablet-specific pointer capabilities
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  return hasTouch && isTabletSize && hasCoarsePointer;
};

export function useIsTabletDevice() {
  const isTabletDevice = useRef<boolean>(isTablet());
  return isTabletDevice.current;
}
