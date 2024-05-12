export function formatDateTime(dateTimeStr: string) {
  const datePart = dateTimeStr.slice(0, 8); // YYYYMMDD
  const timePart = dateTimeStr.slice(9); // HHMMSS

  const year = datePart.slice(0, 4);
  const month = datePart.slice(4, 6);
  const day = datePart.slice(6, 8);

  const hour = timePart.slice(0, 2);
  const minute = timePart.slice(2, 4);
  const second = timePart.slice(4, 6);

  return `${year}-${month}-${day} ${hour}:${minute}:${second} UTC`;
}
