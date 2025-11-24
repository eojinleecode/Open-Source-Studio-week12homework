import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ShowList from "./components/Pages/ShowList";   // 🔥 경로 주의! 슬래시(/) 사용

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ShowList />
  </React.StrictMode>
);