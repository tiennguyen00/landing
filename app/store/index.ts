import { create } from "zustand";

interface SlideState {
  index: number;
  setIndex: (v: number) => void;
  direction: string;
  setDirection: (v: string) => void;
  listening: boolean;
  setListening: (v: boolean) => void;
}

const useSlideStore = create<SlideState>((set) => ({
  index: 0,
  setIndex: (v) => set({ index: v }),
  direction: "down",
  setDirection: (v) => set({ direction: v }),
  listening: false,
  setListening: (v) => set({ listening: v }),
}));

export { useSlideStore };
