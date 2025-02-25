import { useEffect } from "react";
import Stats from "stats.js";

const StatsComponent = () => {
  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0); // 0: FPS, 1: ms, 2: memory
    document.body.appendChild(stats.dom);

    const update = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    return () => document.body.removeChild(stats.dom);
  }, []);

  return <></>;
};

export default StatsComponent;
