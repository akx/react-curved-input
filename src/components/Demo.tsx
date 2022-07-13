import CurveInput, { CurveInfo } from "../../lib";
import React from "react";

export function Demo({
  path,
  width,
  height,
  numPoints,
  renderer,
}: {
  path: string;
  width: number;
  height: number;
  numPoints: number;
  renderer: (curveInfo: CurveInfo) => React.ReactChild;
}) {
  const [pos, setPos] = React.useState(0.1);
  return (
    <div>
      <div>
        Position: {pos.toFixed(2)}&nbsp;
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={pos}
          onChange={(e) => setPos(e.target.valueAsNumber)}
        />
      </div>
      <CurveInput
        path={path}
        width={width}
        height={height}
        numPoints={numPoints}
        position={pos}
        onChange={setPos}
        style={{ border: "1px solid black" }}
      >
        {renderer}
      </CurveInput>
    </div>
  );
}
