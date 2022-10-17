import { MoonStars, SunHigh } from "tabler-icons-react";
import { classNames } from "../utils/utils";

export default function ToggleTheme() {
  function toggleTheme(theme?: "dark" | "light") {
    const htmlElement = document.querySelector("html");
    if (theme === "light" || htmlElement?.classList.contains("dark")) {
      htmlElement?.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      htmlElement?.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }

  return (
    <div className="w-full p-4">
      <div className="bg-primary-gray-200 dark:bg-primary-gray-700 p-3 rounded flex justify-center items-center">
        <SunHigh className="w-5 h-5 text-gray-500" />
        <button
          onClick={() => {
            toggleTheme();
          }}
          className="w-12 h-6 mx-4 p-1 rounded-full bg-primary-indigo-active"
        >
          <div
            className={classNames(
              "dark:translate-x-full dark:justify-end",
              "translate-x-0 justify-start",
              "w-1/2 h-full transition-transform flex"
            )}
          >
            <div className="rounded-full bg-white w-4 h-4" />
          </div>
        </button>
        <MoonStars className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
}
