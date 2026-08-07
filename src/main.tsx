import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { CotacaoLanding } from "./CotacaoLanding";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CotacaoLanding />
  </StrictMode>
);
