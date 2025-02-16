"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = ({
  stateFirstSectionRef,
}: {
  stateFirstSectionRef: any;
}) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const elemen = imgRef.current;
    const revealElemen = revealRef.current;

    if (!revealElemen || !elemen) return;

    const { left, top, width, height } = elemen.getBoundingClientRect();
    const mouseX = ((e.clientX - left) / width) * 100;
    const mouseY = ((e.clientY - top) / height) * 100;

    const polygonPoints = `
            ${mouseX - 2}% ${mouseY - 2}%,
            ${mouseX + 3}% ${mouseY - 3}%,
            ${mouseX + 1}% ${mouseY + 4}%,
            ${mouseX - 1}% ${mouseY + 4}%
        `;

    gsap.to(revealElemen, {
      opacity: 1,
      clipPath: `polygon(${polygonPoints})`,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const revealElemen = revealRef.current;

    gsap.to(revealElemen, {
      opacity: 0,
      clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  useGSAP(() => {
    const tl = gsap.timeline();

    gsap.to(".scroll-marker", {
      y: -15,
      scale: 0.98,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    if (window.innerWidth >= 768) {
      gsap.set(".animation-clip", {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      });

      tl.from(".animation-clip", {
        clipPath: "polygon(64% 90%, 61% 32%, 86% 15%, 93% 49%)",
        transformPerspective: 1000,
        duration: 1.5,
        ease: "power2.inOut",
      });
    } else {
      gsap.set(".animation-clip-mobile", {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      });

      tl.from(".animation-clip-mobile", {
        clipPath: "polygon(39% 12%, 66% 20%, 55% 49%, 34% 35%)",
        transformPerspective: 1000,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }
    tl.pause();
    stateFirstSectionRef.current.tl = tl;

    return () => {
      tl.kill();
    };
  });

  return (
    <div
      className={`w-screen min-h-screen relative flex items-end md:items-center overflow-hidden`}
      id="clip"
      ref={imgRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* IMAGE ON MD LARGER */}
      <div className="absolute size-full animation-clip md:block hidden z-10">
        <Image
          src="/img/banner.webp"
          alt=""
          width={1000}
          height={1000}
          sizes="100vw"
          className="absolute left-0 top-0 size-full object-cover"
        />

        <div className="flex absolute justify-center items-center bottom-4 left-1/2 -translate-x-1/2 scroll-marker">
          <Image src="/img/haku.webp" alt="" width={100} height={100} />
          <div className="flex flex-col items-center">
            <p className="text-white text-3xl font-bold leading-none">
              Explore
            </p>
            <ArrowDown className="text-white w-[40px] h-[40px]" />
          </div>
        </div>

        <div className="absolute top-40 md:left-12 lg:left-20">
          <h1
            className="text-black md:text-[3.5rem] lg:text-[5rem] font-bold leading-[1] bg-white p-2"
            style={{
              textShadow:
                "0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px black, 0 0 45px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.5)",
            }}
          >
            Welcome to <br /> magical world
          </h1>
        </div>
      </div>

      {/* IMAGE ON MOBILE */}
      <div className="absolute size-full animation-clip-mobile md:hidden block z-10">
        <Image
          src="/img/banner-mobile.webp"
          alt=""
          width={1000}
          height={1000}
          sizes="100vw"
          className="absolute left-0 top-0 size-full object-cover"
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full">
          <h1 className="text-white mb-6 text-[2.5rem] font-bold leading-[1] text-center">
            Welcome to <br /> magical world
          </h1>
          <div className="flex justify-center items-center scroll-marker">
            <Image src="/img/haku.webp" alt="" width={50} height={50} />
            <div className="flex flex-col items-center">
              <p className="text-white text-normal font-bold leading-none">
                Explore
              </p>
              <ArrowDown className="text-white w-[20px] h-[20px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute size-full md:hidden block mask-clip-path-1">
        <Image
          src="/img/banner-mobile.webp"
          alt=""
          width={1000}
          height={1000}
          sizes="100vw"
          className="absolute left-0 top-0 size-full object-cover"
        />
      </div>
      <div className="absolute size-full md:hidden block mask-clip-path-2">
        <Image
          src="/img/banner-mobile.webp"
          alt=""
          width={1000}
          height={1000}
          sizes="100vw"
          className="absolute left-0 top-0 size-full object-cover"
        />
      </div>
      <div className="absolute size-full md:hidden block mask-clip-path-3">
        <Image
          src="/img/banner-mobile.webp"
          alt=""
          width={1000}
          height={1000}
          sizes="100vw"
          className="absolute left-0 top-0 size-full object-cover"
        />
      </div>

      <div
        className="absolute size-full opacity-0 md:block hidden z-10"
        ref={revealRef}
      >
        <Image
          src="/img/banner.webp"
          alt=""
          width={1000}
          height={1000}
          sizes="100vw"
          className="absolute left-0 top-0 size-full object-cover"
        />
      </div>

      <div className="absolute w-full h-full md:block hidden">
        <Image
          src="/img/banner-cropped.webp"
          alt=""
          width={1000}
          height={1000}
          sizes="100vw"
          className="absolute size-full object-cover max-md:object-right"
        />
      </div>

      <div className="flex flex-col items-center sm:w-1/2 leading-[1.2] lg:px-20 md:px-12 px-5 -translate-y-10 sm:translate-y-0 max-md:text-center dark:text-white">
        <div>
          <span className="font-medium md:text-[18px] lg:text-[20px] text-[18px] mb-3 md:block hidden">
            Explore the Magic of Ghibli.
          </span>
          <h1 className="lg:text-[4rem] md:text-[3rem] text-[2.5rem] font-bold leading-[1]">
            Dreams and <br /> Adventure Await
          </h1>
          <p className="md:max-w-md mt-5 leading-relaxed md:text-[18px] md:block hidden text-gray-500">
            Step into Studio Ghibli&apos;s enchanting world, where stunning
            landscapes, heartfelt stories, and unforgettable characters come to
            life.
          </p>
          <p className="md:max-w-md mt-5 leading-relaxed md:text-[18px] block md:hidden">
            Step into the world of Studio Ghibli, where breathtaking adventures,
            heartfelt stories, and enchanting landscapes come to life.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Button className="h-[48px] sm:h-[54px] rounded-[12px] bg-black md:text-lg font-semibold">
              Explore more
            </Button>
            <Button className="h-[48px] sm:h-[54px] rounded-[12px] bg-black md:text-lg font-semibold">
              Watch now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
