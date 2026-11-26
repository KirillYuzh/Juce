export const center = (x: number, width: number) => {
  const cx = Math.min(Math.max(x, 0.5), width - 0.5);
  return cx;
};
