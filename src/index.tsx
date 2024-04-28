import { createRoot } from "react-dom/client";
import App from "./App";
import "./Styles/fonts.css";
import { RecoilRoot } from "recoil";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
