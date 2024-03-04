export function getWindowId(id: string) {
  return `win_${id}`;
}

export function getWindowXYById(
  windowsMap: Record<string, WindowData>,
  windowId: string
): [number, number] {
  const windowState = windowsMap[getWindowId(windowId)];
  return [windowState[0], windowState[1]];
}

export function getWindowSizeById(
  windowsMap: Record<string, WindowData>,
  windowId: string
): [number, number] {
  const windowState = windowsMap[getWindowId(windowId)];
  return [windowState[2], windowState[3]];
}

export function getWindowScrollTopById(
  windowsMap: Record<string, WindowData>,
  windowId: string
): number {
  const windowState = windowsMap[getWindowId(windowId)];
  return windowState[4];
}

export function calcCentralizedWindowXY(
  width: number,
  height: number,
  offsetX = 0,
  offsetY = 0
): [number, number] {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const top = (viewportHeight - height) / 2 + offsetY;
  const left = (viewportWidth - width) / 2 + offsetX;
  return [left, top];
}

export function calcMaximizedWindowWidthHeight(
  widthOffsetPx: number,
  heightOffsetPx: number
): [number, number] {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const marginPx = 16;

  // Apply width offset in addition to the margin
  const width = viewportWidth - widthOffsetPx - 2 * marginPx;
  const height = viewportHeight - heightOffsetPx - 2 * marginPx;

  return [width, height];
}
