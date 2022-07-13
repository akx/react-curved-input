import React from "react";

export interface CurveInfo {
  path: string;
  handleX: number;
  handleY: number;
  position: number;
}

export interface CurveInputProps {
  path: string;
  width: number;
  height: number;
  position: number;
  numPoints: number;
  onChange: (pos: number) => void;
  children: (info: CurveInfo) => React.ReactChild;
}
