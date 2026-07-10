import React from "react";
import { createRoot } from "react-dom/client";
import DiamondModel from "./App.jsx?v=public-odds-hosting-20260710";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DiamondModel />
  </React.StrictMode>
);
