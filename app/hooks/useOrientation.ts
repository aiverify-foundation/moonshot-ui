import { useEffect, useState } from 'react';

function initializeOrientation() {
  if (typeof window === 'undefined') return 'landscape';
  return window.screen?.orientation?.type.includes('portrait')
    ? 'portrait'
    : 'landscape';
}

export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    initializeOrientation()
  );
  useEffect(() => {
    const handleOrientationChange = () => {
      if (typeof window === 'undefined') return 'landscape';
      setOrientation(
        window.screen.orientation.type.includes('portrait')
          ? 'portrait'
          : 'landscape'
      );
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
  return orientation;
}
