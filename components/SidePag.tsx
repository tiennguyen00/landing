"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
interface SidePagProps {
  isSliding: number | undefined;
  quantity: number;
  duration: number;
  slideTo: ((index: number) => void) | null;
}

const SidePag = ({ isSliding, quantity, duration, slideTo }: SidePagProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (isSliding !== undefined) {
      setCurrentSlide(isSliding ?? 0);
    }
  }, [isSliding]);
  return (
    <div className={"fixed top-1/2 z-9999 -translate-y-1/2 left-4"}>
      <div
        className="flex relative flex-col items-center w-[32px]"
        style={{
          height: `${70 * (quantity - 1)}px`,
        }}
      >
        <div className="absolute cursor-pointer  justify-between items-center flex-col flex z-10 left-1/2 -translate-x-1/2 w-[4px] h-full bg-[#71705D66]">
          {Array.from({ length: quantity }).map((_, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                slideTo?.(index);
              }}
              className="w-3 h-3 flex justify-center items-center sm:bg-[#71705D] relative rounded-full"
            >
              <div className="bg-yellow-400 animate-ping w-full h-full rounded-full sm:animate-none"></div>
              <div className="bg-yellow-400 absolute w-full h-full rounded-full"></div>
            </div>
          ))}
        </div>
        <div
          className={cn("absolute z-20 -translate-y-1/2 top-0")}
          style={{
            top: `${currentSlide * (100 / (quantity - 1))}%`,
            transition: `all ${duration}s ease-in-out`,
          }}
        >
          {isSliding !== undefined ? (
            <img
              src="/img/chibli-totoro.gif"
              className="h-[48px] aspect-11/8 z-20 w-auto"
              alt="totoro"
            />
          ) : (
            <img
              src="/img/chibli-totoro.png"
              className="w-[32px] aspect-23/32 z-20 h-auto"
              alt="totoro"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePag;
