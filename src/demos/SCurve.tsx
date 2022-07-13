import { CurveInfo } from "../../lib";
import React from "react";
import { Demo } from "../components/Demo";

function renderCurve({ path, handleX, handleY }: CurveInfo) {
  return (
    <>
      <path d={path} fill="none" strokeWidth={4} stroke="#0090b8" />
      <circle
        cx={50}
        cy={40}
        r={10}
        fill="#ffffff"
        strokeWidth={3}
        stroke="#0090b8"
      />

      <text x={50} y={70} textAnchor="middle">
        ZERO!
      </text>
      <circle
        cx={400}
        cy={340}
        r={10}
        fill="#ffffff"
        strokeWidth={3}
        stroke="#0090b8"
      />
      <circle
        cx={handleX}
        cy={handleY}
        r={10}
        fill="#0090b8"
        className="handle"
      />
      <text x={400} y={370} textAnchor="middle">
        UNLIMITED
      </text>
    </>
  );
}

export function SCurve() {
  return (
    <Demo
      path={"M50,40 h300a75 75 0 0 1 0,150h-250a75 75 0 0 0 0,150h300"}
      width={500}
      height={400}
      numPoints={500}
      renderer={renderCurve}
    />
  );
}
