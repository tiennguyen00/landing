import { useCallback, useEffect, useState } from "react";
import { useWindowEvent } from "./useWindowEvent";

const eventListerOptions = {
  passive: true,
};

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  const setSize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useWindowEvent("resize", setSize, eventListerOptions);
  useWindowEvent("orientationchange", setSize, eventListerOptions);
  useEffect(() => {
    setSize();
  }, [setSize]);

  return windowSize;
}
