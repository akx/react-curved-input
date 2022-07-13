import React from "react";
import { SCurve } from "./demos/SCurve";
import { ArchimedeanSpiral } from "./demos/ArchimedeanSpiral";

function Expose() {
  return (
    <>
      <h1>react-curved-input</h1>
      <p>
        This component was originally written as an answer to{" "}
        <a href="https://stackoverflow.com/q/72961879/51685">
          the Stack Overflow question &quot;How to make curved input
          range&quot;.
        </a>
      </p>
      <p>
        In the below demos, you can move the handle along (near) the path with
        the mouse, or use the position slider to see it move.
      </p>
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <Expose />
      <h2>Demos</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        <SCurve />
        <ArchimedeanSpiral />
      </div>
    </div>
  );
}
