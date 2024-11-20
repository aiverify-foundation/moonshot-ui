import { useEffect, useState } from 'react';

export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window?.screen?.orientation?.type?.includes('portrait')
      ? 'portrait'
      : 'landscape'
  );
  useEffect(() => {
    const handleOrientationChange = () => {
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
