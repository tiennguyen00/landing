import { create } from "zustand";

interface MouseState {
  wheelState: "local" | "global";
  setWheelState: (v: "local" | "global") => void;
}

const useMouseStore = create<MouseState>((set) => ({
  wheelState: "global",
  setWheelState: (v) => set({ wheelState: v }),
}));

export { useMouseStore };
