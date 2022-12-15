/**
 * @desc Draw smoothed curve
 * @param {CanvasRenderingContext2D} ctx 
 * @param {[{
 *  x: number,
 *  y: number
 * }]} points 
 * @param {number} tension 
 */
export function drawCurve(ctx, points, tension = null) {
  ctx.moveTo(points[0].x, points[0].y);
  const t = (tension !== null) ? tension : 1;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = (i > 0) ? points[i - 1] : points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = (i != points.length - 2) ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6 * t;
    const cp1y = p1.y + (p2.y - p0.y) / 6 * t;

    const cp2x = p2.x - (p3.x - p1.x) / 6 * t;
    const cp2y = p2.y - (p3.y - p1.y) / 6 * t;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

/**
 * @desc Puts single RGBA pixel to ImageData object
 * @param {ImageData} imageData 
 * @param {number} x 
 * @param {number} y 
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @param {number} a 
 */
export function setImageDataPixel(imageData, x, y, r, g, b, a) {
  const index = 4 * (Math.round(x) + Math.round(y) * imageData.width);
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}