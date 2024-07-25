import {
  getWindowId,
  getWindowXYById,
  getWindowSizeById,
  getWindowScrollTopById,
  calcCentralizedWindowXY,
  calcMaximizedWindowWidthHeight,
  calcTopRightWindowXY,
} from '@/app/lib/window-utils';

describe('window-utils', () => {
  const mockWindowsMap = {
    win_1: [100, 200, 300, 400, 500] as WindowData,
    win_2: [150, 250, 350, 450, 550] as WindowData,
  };

  describe('getWindowId', () => {
    it('should return the correct window id', () => {
      expect(getWindowId('1')).toBe('win_1');
      expect(getWindowId('2')).toBe('win_2');
    });
  });

  describe('getWindowXYById', () => {
    it('should return the correct window XY coordinates', () => {
      expect(getWindowXYById(mockWindowsMap, '1')).toEqual([100, 200]);
      expect(getWindowXYById(mockWindowsMap, '2')).toEqual([150, 250]);
    });
  });

  describe('getWindowSizeById', () => {
    it('should return the correct window size', () => {
      expect(getWindowSizeById(mockWindowsMap, '1')).toEqual([300, 400]);
      expect(getWindowSizeById(mockWindowsMap, '2')).toEqual([350, 450]);
    });
  });

  describe('getWindowScrollTopById', () => {
    it('should return the correct window scroll top', () => {
      expect(getWindowScrollTopById(mockWindowsMap, '1')).toBe(500);
      expect(getWindowScrollTopById(mockWindowsMap, '2')).toBe(550);
    });
  });

  describe('calcCentralizedWindowXY', () => {
    it('should calculate the correct centralized window XY coordinates', () => {
      const [left, top] = calcCentralizedWindowXY(800, 600, 0, 0, false);
      expect(left).toBe((window.innerWidth - 800) / 2);
      expect(top).toBe(Math.max((window.innerHeight - 600) / 2, 50));
    });
  });

  describe('calcMaximizedWindowWidthHeight', () => {
    it('should calculate the correct maximized window width and height', () => {
      const [width, height] = calcMaximizedWindowWidthHeight(100, 100);
      expect(width).toBe(window.innerWidth - 100 - 32);
      expect(height).toBe(window.innerHeight - 100 - 32);
    });
  });

  describe('calcTopRightWindowXY', () => {
    it('should calculate the correct top right window XY coordinates', () => {
      const [left, top] = calcTopRightWindowXY(800, 600, 0, 0);
      expect(left).toBe(window.innerWidth - 800);
      expect(top).toBe(0);
    });
  });
});
