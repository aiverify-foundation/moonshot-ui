export function getWindowId(id: string) {
  return `win_${id}`;
}

export function getWindowXY(
  windowsMap: Record<string, WindowData>,
  windowId: string
): [number, number] {
  const windowState = windowsMap[getWindowId(windowId)];
  return [windowState[0], windowState[1]];
}

export function getWindowSize(
  windowsMap: Record<string, WindowData>,
  windowId: string
): [number, number] {
  const windowState = windowsMap[getWindowId(windowId)];
  return [windowState[2], windowState[3]];
}

export function getWindowScrollTop(
  windowsMap: Record<string, WindowData>,
  windowId: string
): number {
  const windowState = windowsMap[getWindowId(windowId)];
  return windowState[4];
}
