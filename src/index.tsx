import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { worker } from "./api/mock";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const container = document.getElementById("root")!;
const root = createRoot(container);

async function main() {
  if (process.env.NODE_ENV === "development") {
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  root.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        {/** Needs touch backend implementation with react-dnd-preview */}
        <DndProvider
          backend={HTML5Backend}
          options={{ enableMouseEvents: true, delay: 10 }}
        >
          <App />
        </DndProvider>
      </ReduxProvider>
    </React.StrictMode>
  );
}

main();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
