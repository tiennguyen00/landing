"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import CarouselSlide from "./CarouselSlide";
import { useSlideStore } from "@/app/store";
import LoadingScreen from "./LoadingScreen";
import { useProgress } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

const ABSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { index } = useSlideStore();

  useEffect(() => {
    if (index === 1 && !isLoaded) {
      setIsLoaded(true);
    }
  }, [index]);

  const total = useProgress((state) => state.total);

  return (
    <div className="w-full min-h-[100dvh] overflow-hidden flex flex-col items-center relative px-0!">
      <LoadingScreen total={total} />
      {isLoaded && <CarouselSlide />}
    </div>
  );
};

export default ABSection;
