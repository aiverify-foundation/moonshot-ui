import { formatDate, formatDateFromTimestamp } from '@/app/lib/date-utils';

describe('formatDate', () => {
  it('should format date string correctly', () => {
    const dateString = '2024-05-13 14:17:47';
    const formattedDate = formatDate(dateString);
    expect(formattedDate).toBe('May 13, 2024, 14:17:47');
  });

  it('should handle invalid date string', () => {
    const dateString = 'invalid-date';
    const formattedDate = formatDate(dateString);
    expect(formattedDate).toBe('Invalid Date');
  });
});

describe('formatDateFromTimestamp', () => {
  it('should format timestamp correctly', () => {
    const timestamp = 1715607467;
    const formattedDate = formatDateFromTimestamp(timestamp);
    expect(formattedDate).toBe('May 13, 2024, 13:37:47');
  });

  it('should handle invalid timestamp', () => {
    const timestamp = NaN;
    const formattedDate = formatDateFromTimestamp(timestamp);
    expect(formattedDate).toBe('Invalid Date');
  });
});
