import { useEffect, useReducer } from 'react';
import { debounce } from '@/app/lib/throttle';

export type SlideChatBoxDimensions = {
  width: number;
  height: number;
  gap: number;
  noOfChatBoxesPerSlide: number;
  promptBoxWidth: number;
};

const defaultChatElementSizes: SlideChatBoxDimensions = {
  width: 420,
  height: 500,
  gap: 50,
  noOfChatBoxesPerSlide: 3,
  promptBoxWidth: 500,
};

function chatElementSizesReducer() {
  if (window.matchMedia('(min-width: 1371px)').matches) {
    return {
      width: 420,
      height: 500,
      gap: 50,
      noOfChatBoxesPerSlide: 3,
      promptBoxWidth: 500,
    };
  }

  if (
    window.matchMedia('(min-width: 1195px) and (max-width: 1370px)').matches
  ) {
    return {
      width: 340,
      height: 500,
      gap: 35,
      noOfChatBoxesPerSlide: 3,
      promptBoxWidth: 420,
    };
  }

  if (window.matchMedia('(max-width: 1194px)').matches) {
    return {
      width: 320,
      height: 450,
      gap: 30,
      noOfChatBoxesPerSlide: 2,
      promptBoxWidth: 400,
    };
  }

  return defaultChatElementSizes;
}

export function useResponsiveChatboxSize(): SlideChatBoxDimensions {
  const [
    { width, height, gap, noOfChatBoxesPerSlide, promptBoxWidth },
    dispatch,
  ] = useReducer(chatElementSizesReducer, defaultChatElementSizes);

  useEffect(() => {
    dispatch();
  }, []);

  useEffect(() => {
    const handleResize = debounce(() => dispatch(), 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { width, height, gap, noOfChatBoxesPerSlide, promptBoxWidth };
}
