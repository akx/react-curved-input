import React from "react";
import { computePathPoints, findClosestPoint } from "./points";
import { CurveInputProps } from "./types";

export default function CurveInput({
  path,
  width,
  height,
  numPoints,
  position,
  onChange,
  children,
  ...svgProps
}: CurveInputProps & Omit<JSX.IntrinsicElements["svg"], "onChange">) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const isTrackingRef = React.useRef<boolean>(false);
  const pathPoints = React.useMemo(
    () => computePathPoints(path, numPoints),
    [path, numPoints],
  );
  const maxThreshold = Math.max(width, height) * 0.08;
  const handlePointIndex = Math.max(
    0,
    Math.min(numPoints - 1, Math.round(position * numPoints)),
  );
  const [handleX, handleY] = pathPoints[handlePointIndex];
  const handleMotion = React.useCallback(
    (event) => {
      const svg = svgRef.current;
      if (!svg) return;
      const { bottom, left, right, top } = svg.getBoundingClientRect();
      const { clientX, clientY } = event;
      const x = ((clientX - left) / (right - left)) * width;
      const y = ((clientY - top) / (bottom - top)) * height;
      const pointIndex = findClosestPoint(pathPoints, x, y, 5, maxThreshold);
      if (pointIndex !== undefined) {
        const newPos = pointIndex / (numPoints - 1);
        onChange(newPos);
      }
    },
    [width, height, pathPoints, maxThreshold, numPoints, onChange],
  );
  const startTracking = React.useCallback(() => {
    isTrackingRef.current = true;
  }, []);
  const onMotion = React.useCallback(
    (event) => {
      if (isTrackingRef.current) handleMotion(event);
    },
    [handleMotion],
  );
  React.useEffect(() => {
    if (!window) return;
    const handleMouseUp = () => (isTrackingRef.current = false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  });

  return React.createElement(
    "svg",
    {
      ref: svgRef,
      viewBox: `0 0 ${width} ${height}`,
      ...svgProps,
      onMouseDown: startTracking,
      onMouseMove: onMotion,
      onClick: onMotion,
    },
    children({ path, handleX, handleY, position }),
  );
}
