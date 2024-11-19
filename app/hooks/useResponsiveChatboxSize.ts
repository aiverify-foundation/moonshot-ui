import { useEffect, useState } from 'react';
import { debounce } from '@/app/lib/throttle';

export type SlideChatBoxDimensions = {
  width: number;
  height: number;
  gap: number;
};

// IMPORTANT: align the values of --chatwindow-width and --gap-width css variables in global.css
function calculateChatboxSizes() {
  console.log('recalculation of chatbox sizes');
  if (window.matchMedia('(min-width: 1195px)').matches) {
    return { width: 420, height: 500, gap: 50 };
  }

  if (window.matchMedia('(max-width: 1194px)').matches) {
    return { width: 320, height: 450, gap: 30 };
  }

  return { width: 420, height: 550, gap: 50 };
}

export function useResponsiveChatboxSize(): SlideChatBoxDimensions {
  const [{ width, height, gap }, setSizes] = useState<SlideChatBoxDimensions>(
    () => calculateChatboxSizes()
  );

  useEffect(() => {
    const handleResize = debounce(() => {
      setSizes(calculateChatboxSizes());
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { width, height, gap };
}
