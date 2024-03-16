import { updateWindows, useAppDispatch } from '@/lib/redux';
import { calcCentralizedWindowXY, getWindowId } from '@app/lib/window-utils';
import {
  WindowIds,
  defaultWindowWidthHeight,
} from '@views/moonshot-desktop/constants';

export type ResetWindowsFunction = (...ids: WindowIds[]) => void;

export function useResetWindows(randomizeOffsets = true): ResetWindowsFunction {
  const dispatch = useAppDispatch();

  return (...ids: WindowIds[]) => {
    //reset window dimensions to defaults
    const defaults: Record<string, WindowData> = {};
    ids.reduce((acc, id) => {
      acc[getWindowId(id)] = [
        ...calcCentralizedWindowXY(
          ...defaultWindowWidthHeight[id],
          0,
          0,
          randomizeOffsets
        ),
        defaultWindowWidthHeight[id][0],
        defaultWindowWidthHeight[id][1],
        0,
      ];
      return acc;
    }, defaults);

    dispatch(updateWindows(defaults));
  };
}
