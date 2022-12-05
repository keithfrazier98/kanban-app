import "react-app-polyfill/stable";
import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initServiceWorkers } from "./api/mock";
import { connectToIDB } from "./api/indexeddb";

const container = document.getElementById("root")!;
const root = createRoot(container);

connectToIDB(() => initServiceWorkers());

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
