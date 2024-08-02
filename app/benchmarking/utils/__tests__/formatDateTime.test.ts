import { formatDateTime } from '@/app/benchmarking/utils/formatDateTime';

describe('formatDateTime', () => {
  test('formats date and time correctly', () => {
    const input = '20230101T123456';
    const expectedOutput = '2023-01-01 12:34:56 UTC';
    expect(formatDateTime(input)).toBe(expectedOutput);
  });
});
