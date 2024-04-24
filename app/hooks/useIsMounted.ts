import { useCallback, useEffect, useRef } from 'react';

function useIsMounted() {
  const isMountedRef = useRef<boolean>(false);

  const isMounted = useCallback(() => {
    return isMountedRef.current;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMounted;
}

export { useIsMounted };
