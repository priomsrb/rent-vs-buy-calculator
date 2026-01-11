export const centeredTooltipPosition = (
  point: [number, number],
  _params: unknown,
  _dom: unknown,
  _rect: unknown,
  size: { contentSize: [number, number]; viewSize: [number, number] },
) => {
  const [mouseX, mouseY] = point;
  const [tooltipWidth, tooltipHeight] = size.contentSize;
  const [viewWidth, viewHeight] = size.viewSize;

  // Offset from cursor
  const offsetY = 20;

  // Calculate x position - prefer centered around mouse
  let x = mouseX - tooltipWidth / 2;

  // Ensure not off-screen to the right
  if (x + tooltipWidth > viewWidth) {
    x = viewWidth - tooltipWidth;
  }
  // Ensure not off-screen to the left
  x = Math.max(0, x);

  // Calculate y position - prefer below cursor, flip to above if needed
  let y = mouseY + offsetY;
  if (y + tooltipHeight > viewHeight) {
    y = mouseY - tooltipHeight - offsetY;
  }
  // Ensure not off-screen to the top
  y = Math.max(0, y);

  return [x, y];
};
