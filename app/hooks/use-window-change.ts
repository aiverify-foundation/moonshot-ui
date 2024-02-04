import { useAppDispatch } from '@/lib/redux';
import { updateWindows } from '@/lib/redux/slices/windowsSlice';

export function useWindowChange() {
  const dispatch = useAppDispatch();

  function handleOnWindowChange(
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) {
    dispatch(
      updateWindows({ [windowId]: [x, y, width, height, scrollTop] })
    );
  }

  return handleOnWindowChange;
}
