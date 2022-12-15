/**
 * @typedef {{
 *  x: number,
 *  y: number
 * }} Point
 */


/**
 * @desc Check point inside the rectangle
 * @param {Point} point 
 * @param {{
 *  x: number,
 *  y: number,
 *  width: number,
 *  height: number
 * }} rect 
 * @returns 
 */
export function isPointInsideRect(point, rect) {
  return rect.x <= point.x && point.x <= rect.x + rect.width && rect.y <= point.y && point.y <= rect.y + rect.height;
}

/**
 * @desc Checks is point inside a polygon
 * @param {Point} point 
 * @param {[Point]} vertices 
 */
export function isPointInsidePolygon(point, vertices) {
  const x = point.x;
  const y = point.y;
  let inside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;

    const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * @desc Rotate point around an origin
 * @param {Point} point 
 * @param {Point} origin 
 * @param {number} angle 
 * @returns {Point}
 */
export function rotatePoint(point, origin, angle) {
  return {
    x: Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x,
    y: Math.sin(angle) * (point.x  - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y
  };
}