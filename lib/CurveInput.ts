import React from "react";
import { computePathPoints, findClosestPoint } from "./points";
import { CurveInputProps, Point } from "./types";

function getEventXY(
  event: TouchEvent | MouseEvent,
  touchId: number,
): Point | undefined {
  if ("changedTouches" in event) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === touchId) {
        return [touch.clientX, touch.clientY];
      }
    }
    return undefined;
  }
  return [event.clientX, event.clientY];
}

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
  const trackingRef = React.useRef<number | null>(null);
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
      if (!svg || trackingRef.current === null) return;
      const coords = getEventXY(event, trackingRef.current);
      if (!coords) return;
      const { bottom, left, right, top } = svg.getBoundingClientRect();
      const [clientX, clientY] = coords;
      const x = ((clientX - left) / (right - left)) * width;
      const y = ((clientY - top) / (bottom - top)) * height;
      const pointIndex = findClosestPoint(pathPoints, x, y, 5, maxThreshold);
      if (pointIndex !== undefined) {
        const newPos = pointIndex / (numPoints - 1);
        onChange(newPos);
        // If this caused motion, don't scroll (e.g. touches).
        event.preventDefault();
      }
      // See if the event finalized this motion; if so, stop tracking.
      const { type } = event;
      if (type === "mouseup" || type === "touchend" || type === "touchcancel") {
        trackingRef.current = null;
      }
    },
    [width, height, pathPoints, maxThreshold, numPoints, onChange],
  );
  const startTracking = React.useCallback((event) => {
    event.stopPropagation();
    if (event.type.startsWith("touch")) {
      trackingRef.current = event.changedTouches[0].identifier;
    } else {
      trackingRef.current = -1;
    }
  }, []);
  const onMotion = React.useCallback(
    (event) => {
      if (trackingRef.current !== null) handleMotion(event);
    },
    [handleMotion],
  );
  React.useEffect(() => {
    if (!window) return;
    window.addEventListener("mouseup", onMotion);
    window.addEventListener("touchend", onMotion);
    window.addEventListener("touchcancel", onMotion);
    return () => {
      window.removeEventListener("mouseup", onMotion);
      window.removeEventListener("touchend", onMotion);
      window.removeEventListener("touchcancel", onMotion);
    };
  }, [onMotion]);

  return React.createElement(
    "svg",
    {
      ref: svgRef,
      viewBox: `0 0 ${width} ${height}`,
      ...svgProps,
      onMouseDown: startTracking,
      onTouchStart: startTracking,
      onTouchMove: onMotion,
      onMouseMove: onMotion,
    },
    children({ path, handleX, handleY, position }),
  );
}
