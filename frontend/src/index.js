import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./App"; // Import Root component

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
  // Ensure <Root /> is wrapped inside React.StrictMode for debugging improvements
);
if (typeof window !== "undefined") {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => {};
}
