export function lerp(start: number, end: number, t: number): number {
  return (1 - t) * start + t * end;
}
