"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const ABSection = () => {
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
    <section className="w-full min-h-screen flex flex-col py-20 md:max-w-7xl mx-auto md:px-10 px-5 relative">
      <div
        className="flex flex-col items-center text-center gap-2 headline-container w-fit mx-auto dark:text-white "
        ref={headlineRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <h1 className="text-black relative dark:text-white text-[16px] md:text-[20px] font-medium">
          Explore worlds, beloved characters, and stories
          <div className="bg-transparent absolute left-0 top-0 -translate-x-[calc(100%+15px)] dark:bg-white w-[50px] h-[50px] rounded-full animated-box">
            <Image
              src="/img/kuro02.svg"
              alt="ghibli-logo"
              className="translate-y-1"
              width={50}
              height={50}
            />
          </div>
        </h1>
        <h1 className="md:text-[4rem] relative text-[2.5rem] font-bold leading-tight headline">
          Step Into the <br /> Ghibli Universe
          <div className="bg-transparent absolute right-0 bottom-0 translate-x-[calc(100%+15px)] -translate-y-1/4 dark:bg-white w-[50px] h-[50px] rounded-full animated-box">
            <Image
              src="/img/kuro02.svg"
              alt="ghibli-logo"
              className="translate-y-1"
              width={50}
              height={50}
            />
          </div>
        </h1>
      </div>
    </section>
  );
};

export default ABSection;
