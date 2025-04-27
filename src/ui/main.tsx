import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ElectronRouter from "./components/ElectronRouter";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ElectronRouter>
      <App />
    </ElectronRouter>
  </StrictMode>,
);
