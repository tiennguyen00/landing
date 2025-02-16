import { create } from "zustand";

interface SlideState {
  index: number;
  setIndex: (v: number) => void;
}

const useSlideStore = create<SlideState>((set) => ({
  index: 0,
  setIndex: (v) => set({ index: v }),
}));

export { useSlideStore };
