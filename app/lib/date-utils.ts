// takes in '2024-05-13 14:17:47' and output '14:17:47 13 May 2024'
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleString('en-US', options);
}
