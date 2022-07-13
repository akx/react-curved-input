type Point = [number, number];

/**
 * Given an SVG path, compute its points at the resolution of `n` total points.
 */
export function computePathPoints(path: string, n = 100): Point[] {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  el.setAttribute("d", path);
  const length = el.getTotalLength();
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    const p = (i / (n - 1)) * length;
    const { x, y } = el.getPointAtLength(p);
    points.push([x, y]);
  }
  return points;
}

/**
 * Given an array of points, find the index of the point closest to x/y.
 * If a point is less than minThreshold points away from x/y,
 * it is immediately returned.
 * Points farther than maxThreshold away from x/y are ignored.
 */
export function findClosestPoint(
  points: readonly Point[],
  x: number,
  y: number,
  minThreshold: number,
  maxThreshold: number,
): number | undefined {
  const minThresholdSq = minThreshold * minThreshold;
  const maxThresholdSq = maxThreshold * maxThreshold;
  let bestIndex: number | undefined;
  let bestDist: number = Number.MAX_VALUE;
  for (let i = 0; i < points.length; i++) {
    const [px, py] = points[i];
    const dist = (px - x) ** 2 + (py - y) ** 2;
    if (dist < minThresholdSq) return i;
    if (dist > maxThresholdSq) continue;
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  }
  return bestIndex;
}
