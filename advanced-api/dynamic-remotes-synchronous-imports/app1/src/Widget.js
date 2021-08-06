import React from "react";
import moment from "moment";
import ButtonRemote from 'app2/Button';

export default function Widget() {
  return (
    <div
      style={{
        borderRadius: "4px",
        padding: "2em",
        backgroundColor: "red",
        color: "white",
      }}
    >
      <h2>App 1 Widget</h2>
      <p>
        {moment().format("MMMM Do YYYY, h:mm:ss a")}
      </p>

      <React.Suspense fallback="Loading widget">
          <ButtonRemote />
      </React.Suspense>
    </div>
  );
}
