"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import CarouselSlide from "./CarouselSlide";

gsap.registerPlugin(ScrollTrigger);

const ABSectionV2 = () => {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      headlineRef.current,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 75%",
          end: "bottom 25%",
          scrub: 1,
        },
      }
    );

    const boxes = gsap.utils.toArray(".animated-box"); // Select all elements with this class

    gsap.to(boxes, {
      y: () => gsap.utils.random(-20, 20), // Moves down
      duration: 1.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tl.to(boxes, {
      rotation: 360,
      duration: 1.5,
      ease: "power2.inOut",
    });
  }, []);

  const handleMouseMove = (e: any) => {
    const elemen = headlineRef.current;
    if (!elemen) return;

    const { left, top, height, width } = elemen.getBoundingClientRect();

    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 20;
    const tiltY = (relativeX - 0.5) * -20;

    gsap.to(elemen, {
      rotateY: tiltY,
      rotateX: tiltX,
      translateZ: (relativeY - 0.5) * 50,
      transformPerspective: 700,
      ease: "power3.out",
      duration: 0.5,
    });
  };

  const handleMouseLeave = () => {
    const elemen = headlineRef.current;
    if (!elemen) return;

    gsap.to(elemen, {
      rotateY: 0,
      rotateX: 0,
      translateZ: 0,
      ease: "power3.out",
      duration: 0.5,
    });
  };

  return (
    <div className="w-full  min-h-[100dvh] overflow-hidden flex flex-col items-center relative padding">
      {/* <div
        className="flex flex-col items-center text-center headline-container mx-auto dark:text-white "
        ref={headlineRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <h1 className="text-black relative dark:text-white text-[16px] md:text-[18px] font-medium">
          Explore worlds, beloved characters, and stories
          <div className="bg-transparent absolute hidden sm:block left-0 top-0 -translate-x-[calc(100%+15px)] dark:bg-white w-[50px] h-[50px] rounded-full">
            <Image
              src="/img/kuro02.svg"
              alt="ghibli-logo"
              className="translate-y-1  animated-box"
              width={50}
              height={50}
            />
            <div className="absolute hidden top-0 right-full sm:flex items-center -translate-x-4 justify-center w-fit px-2 pr-3 py-1 bg-white border-2 border-black rounded-xl">
              <p className="truncate text-black text-[16px] md:text-[18px]">
                Wass new
              </p>
              <div className="absolute right-0 top-1/2 translate-x-[10.5px] -translate-y-1/2 w-5 h-5 bg-white border-l-2 border-b-2 border-black rotate-[225deg]"></div>
            </div>
          </div>
        </h1>

        <h1 className="md:text-[3rem] mb-2 relative text-[2.5rem] font-bold leading-none headline">
          Step Into the <br /> Ghibli Universe
          <div className="bg-transparent absolute hidden sm:block right-0 bottom-0 translate-x-[calc(100%+15px)] -translate-y-1/4 dark:bg-white w-[50px] h-[50px] rounded-full">
            <Image
              src="/img/kuro02.svg"
              alt="ghibli-logo"
              className="translate-y-1  animated-box"
              width={50}
              height={50}
            />
            <div className="absolute top-0 left-full flex items-center translate-x-4 justify-center w-fit px-2 pl-3 py-2 bg-white border-2 border-black rounded-xl">
              <p className="truncate text-[16px] md:text-[18px] font-medium text-black">
                Let explore
              </p>
              <div className="absolute left-0 top-1/2 -translate-x-[10.5px] -translate-y-1/2 w-5 h-5 bg-white border-l-2 border-b-2 border-black rotate-[45deg]"></div>
            </div>
          </div>
        </h1>
      </div> */}

      <CarouselSlide />
    </div>
  );
};

export default ABSectionV2;
