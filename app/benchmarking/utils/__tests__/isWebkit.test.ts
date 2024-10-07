import { isWebkit } from '@/app/benchmarking/utils/isWebkit';

describe('isWebkit', () => {
  it('should return true for Safari on macOS', () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15';
    Object.defineProperty(navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
    expect(isWebkit()).toBe(true);
  });

  it('should return false for Chrome on macOS', () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36';
    Object.defineProperty(navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
    expect(isWebkit()).toBe(false);
  });

  it('should return false for Chrome on Android', () => {
    const userAgent =
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Mobile Safari/537.36';
    Object.defineProperty(navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
    expect(isWebkit()).toBe(false);
  });

  it('should return true for WebKit-based browser on iOS', () => {
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    Object.defineProperty(navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
    expect(isWebkit()).toBe(true);
  });

  it('should return false for non-WebKit browser', () => {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0';
    Object.defineProperty(navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
    expect(isWebkit()).toBe(false);
  });
});
