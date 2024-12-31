import '@testing-library/jest-dom';

HTMLCanvasElement.prototype.getContext = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: false,
  })),
});
