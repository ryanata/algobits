import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "./style.css";
const updateApp = registerSW({
  onOfflineReady() {
    window.dispatchEvent(new Event("algobits-offline-ready"));
  },
  onNeedRefresh() {
    window.dispatchEvent(new Event("algobits-update-ready"));
  },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

window.addEventListener("algobits-apply-update", () => {
  void updateApp(true);
});
