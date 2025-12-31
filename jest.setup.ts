import '@testing-library/jest-dom';

HTMLCanvasElement.prototype.getContext = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: false,
  })),
});

// Mock html2pdf.js to avoid ES module import issues with jspdf
jest.mock('html2pdf.js', () => {
  return jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    save: jest.fn().mockResolvedValue(undefined),
  }));
});
