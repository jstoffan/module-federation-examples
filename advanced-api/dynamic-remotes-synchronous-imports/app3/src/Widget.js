import React from "react";
import moment from "moment";

export default function Widget() {
  return (
    <div
      style={{
        borderRadius: "4px",
        padding: "2em",
        backgroundColor: "blue",
        color: "white",
      }}
    >
      <h2>App 3 Widget</h2>
      <p>{moment().format("MMMM Do YYYY, h:mm:ss a")}</p>
    </div>
  );
}
