import { useEffect, useRef, useState } from "react";

export default function useTransitionState(
  unMountFunction: () => void
): [boolean, () => void] {
  const [render, setRender] = useState(false);
  let hasRendered = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      setRender(true);
      hasRendered.current = true;
    }, 0);
  }, []);

  useEffect(() => {
    if (!render && hasRendered.current) {
      setTimeout(() => {
        console.log("Calling the unmount function");
        unMountFunction();
        // all modals take 150ms to fade out
      }, 150);
    }
  }, [render, unMountFunction]);

  return [render, () => setRender(false)];
}
