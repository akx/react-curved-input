import React from "react";
function computePathPoints(path, n = 100) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  el.setAttribute("d", path);
  const length = el.getTotalLength();
  const points = [];
  for (let i = 0; i < n; i++) {
    const p = i / (n - 1) * length;
    const { x, y } = el.getPointAtLength(p);
    points.push([x, y]);
  }
  return points;
}
function findClosestPoint(points, x, y, minThreshold, maxThreshold) {
  const minThresholdSq = minThreshold * minThreshold;
  const maxThresholdSq = maxThreshold * maxThreshold;
  let bestIndex;
  let bestDist = Number.MAX_VALUE;
  for (let i = 0; i < points.length; i++) {
    const [px, py] = points[i];
    const dist = (px - x) ** 2 + (py - y) ** 2;
    if (dist < minThresholdSq)
      return i;
    if (dist > maxThresholdSq)
      continue;
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  }
  return bestIndex;
}
function CurveInput({
  path,
  width,
  height,
  numPoints,
  position,
  onChange,
  children,
  ...svgProps
}) {
  const svgRef = React.useRef(null);
  const isTrackingRef = React.useRef(false);
  const pathPoints = React.useMemo(() => computePathPoints(path, numPoints), [path, numPoints]);
  const maxThreshold = Math.max(width, height) * 0.08;
  const handlePointIndex = Math.max(0, Math.min(numPoints - 1, Math.round(position * numPoints)));
  const [handleX, handleY] = pathPoints[handlePointIndex];
  const handleMotion = React.useCallback((event) => {
    const svg = svgRef.current;
    if (!svg)
      return;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pointIndex = findClosestPoint(pathPoints, x, y, 5, maxThreshold);
    if (pointIndex !== void 0) {
      const newPos = pointIndex / (numPoints - 1);
      onChange(newPos);
    }
  }, [onChange, pathPoints, numPoints, maxThreshold]);
  const startTracking = React.useCallback(() => {
    isTrackingRef.current = true;
  }, []);
  const onMotion = React.useCallback((event) => {
    if (isTrackingRef.current)
      handleMotion(event);
  }, [handleMotion]);
  React.useEffect(() => {
    if (!window)
      return;
    const handleMouseUp = () => isTrackingRef.current = false;
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  });
  return React.createElement("svg", {
    ref: svgRef,
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    ...svgProps,
    onMouseDown: startTracking,
    onMouseMove: onMotion,
    onClick: onMotion
  }, children({ path, handleX, handleY, position }));
}
export { CurveInput as default };
