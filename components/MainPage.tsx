"use client";
import Footer from "./Footer";
import HeroSection from "./HeroSection";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";
import Navbar from "./Navbar";
import SidePag from "./SidePag";
import { useSlideStore } from "@/app/store";
import SceneContainer from "./Scene";
import ABSection from "./ABSection";

export interface StateSection {
  tl: gsap.core.Timeline | null;
  progress: "start" | "end";
}

const MainPage = () => {
  const curSlide = useRef<number | null>(null);
  const next = useRef(0);
  const listening = useRef(true);
  const direction = useRef("down");
  const touch = useRef({
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    startTime: 0,
    dt: 0,
  });
  const offset = 10,
    duration = 1.25;

  const tlDefaults = {
    ease: "slow.inOut",
    duration: duration,
  };
  const slideTo = useRef<((index: number) => void) | null>(null);

  const [isSliding, setIsSliding] = useState<number | undefined>(undefined);
  const stateFirstSectionRef = useRef<StateSection>({
    tl: null,
    progress: "start",
  });
  const { setIndex, setDirection, setListening } = useSlideStore();

  // Get initial section from URL
  const [sectionIndex, setSectionIndex] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("section");
    }
    return null;
  });

  const updateSectionParam = (sectionIndex: number) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("section", sectionIndex.toString());
      window.history.pushState({}, "", url);
      setSectionIndex(sectionIndex.toString());
    }
  };

  useGSAP(() => {
    const sections = document.querySelectorAll("section");
    const outerWrappers = gsap.utils.toArray(".outer");
    const innerWrappers = gsap.utils.toArray(".inner");
    const wrapper = gsap.utils.toArray(".wrapper");

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

    // Initialize with the correct section if provided in URL
    const initialSection = parseInt(sectionIndex ?? "0");
    if (!isNaN(initialSection) && initialSection > 0) {
      next.current = initialSection;
      curSlide.current = initialSection;

      sections.forEach((section, idx) => {
        gsap.set(section as Element, {
          autoAlpha: idx === initialSection ? 1 : 0,
          zIndex: idx === initialSection ? 5 : 0,
        });
      });

      // Set initial positions for the target section
      gsap.set(
        [
          outerWrappers[initialSection],
          innerWrappers[initialSection],
        ] as Element[],
        {
          yPercent: 0,
        }
      );
      gsap.set(wrapper[initialSection] as Element, { yPercent: 0 });

      setIndex(initialSection);
    } else {
      slideIn();
    }

    function handleDirection() {
      listening.current = false;
      setListening(false);

      if (direction.current === "down") {
        // check if the first section is at the start
        if (
          stateFirstSectionRef.current.progress === "start" &&
          (curSlide.current === 0 || curSlide.current === null)
        ) {
          stateFirstSectionRef.current.tl?.play().then(() => {
            stateFirstSectionRef.current.progress = "end";
            listening.current = true;
            setListening(true);
          });
          return;
        }
        // ==========================================

        next.current = (curSlide.current ?? 0) + 1;
        if (next.current >= sections.length) next.current = 0;
        slideIn();
      }

      if (direction.current === "up") {
        // check if the first section is at the end
        if (
          stateFirstSectionRef.current.progress === "end" &&
          (curSlide.current === 0 || curSlide.current === null)
        ) {
          stateFirstSectionRef.current.tl?.reverse().then(() => {
            stateFirstSectionRef.current.progress = "start";
            listening.current = true;
            setListening(true);
          });
          return;
        }
        // ==========================================

        next.current = (curSlide.current ?? 0) - 1;
        if (next.current < 0) next.current = sections.length - 1;
        slideOut();
      }
    }

    function handleWheel(e: WheelEvent) {
      if (!listening.current) return;
      direction.current = e.deltaY < 0 ? "up" : "down";
      console.log("wheel event", direction.current);
      setDirection(direction.current);
      handleDirection();
    }

    function handleTouchStart(e: TouchEvent) {
      if (!listening.current) return;
      const t = e.changedTouches[0];
      touch.current.startX = t.pageX;
      touch.current.startY = t.pageY;
    }

    function handleTouchMove(e: TouchEvent) {
      if (!listening.current) return;
      e.preventDefault();
    }
    function handleTouchEnd(e: TouchEvent) {
      if (!listening.current) return;
      const t = e.changedTouches[0];
      touch.current.dx = t.pageX - touch.current.startX;
      touch.current.dy = t.pageY - touch.current.startY;
      if (touch.current.dy <= 50 && touch.current.dy >= -50) return;
      if (touch.current.dy > 50) direction.current = "up";
      if (touch.current.dy < -50) direction.current = "down";
      setDirection(direction.current);
      handleDirection();
    }
    // Handle the event
    window.addEventListener("wheel", handleWheel);
    // window.addEventListener("touchstart", handleTouchStart);
    // window.addEventListener("touchmove", handleTouchMove);
    // window.addEventListener("touchend", handleTouchEnd);

    function slideIn() {
      setIsSliding(next.current);
      if (curSlide.current !== null)
        gsap.set(sections[curSlide.current], {
          zIndex: 0,
          autoAlpha: 0,
        });

      gsap.set(sections[next.current], {
        autoAlpha: 1,
        zIndex: 5,
      });
      gsap.set(wrapper[next.current] as any, { yPercent: 0 });

      const tl = gsap
        .timeline({
          paused: true,
          defaults: tlDefaults,
          onComplete: () => {
            listening.current = true;
            setListening(true);
            curSlide.current = next.current;
            setIsSliding(undefined);
            setIndex(curSlide.current);
          },
          onStart: () => {
            updateSectionParam(next.current);
          },
        })
        .to(
          [outerWrappers[next.current], innerWrappers[next.current]],
          {
            yPercent: 0,
          },
          0
        )
        .from(wrapper[next.current] as any, { yPercent: offset }, 0);
      // .add(revealSectionHeading(), 0);

      if (curSlide.current !== null) {
        tl.add(
          gsap.to(wrapper[curSlide.current] as any, {
            yPercent: -offset,
            ...tlDefaults,
          }),
          0
        ).add(
          gsap
            .timeline()
            .set(outerWrappers[curSlide.current] as any, { yPercent: 100 })
            .set(innerWrappers[curSlide.current] as any, { yPercent: -100 })
            .set(wrapper[curSlide.current] as any, { yPercent: 0 })
            .set(sections[curSlide.current], { autoAlpha: 0 })
        );
      }

      tl.play(0);
    }

    // Slide to section
    slideTo.current = (index: number) => {
      if (!listening.current || index === curSlide.current) return;
      if (index < 0 || index >= sections.length) return;

      direction.current = index > (curSlide.current ?? 0) ? "down" : "up";
      setDirection(direction.current);

      next.current = index;
      updateSectionParam(index);
      if (direction.current === "down") {
        slideIn();
      } else {
        slideOut();
      }
    };

    // Slides a section out on scroll up
    function slideOut() {
      setIsSliding(next.current);
      gsap.set(sections[curSlide.current ?? 0], {
        zIndex: 0,
        autoAlpha: 0,
      });
      gsap.set(sections[next.current], {
        autoAlpha: 1,
        zIndex: 1,
      });

      gsap.set([outerWrappers[next.current], innerWrappers[next.current]], {
        yPercent: 0,
      });
      gsap.set(wrapper[next.current] as any, { yPercent: 0 });

      gsap
        .timeline({
          defaults: tlDefaults,
          onComplete: () => {
            listening.current = true;
            setListening(true);
            curSlide.current = next.current;
            setIsSliding(undefined);
            setIndex(curSlide.current);
          },
          onStart: () => {
            updateSectionParam(next.current);
          },
        })
        .to(outerWrappers[curSlide.current ?? 0] as any, { yPercent: 100 }, 0)
        .to(innerWrappers[curSlide.current ?? 0] as any, { yPercent: -100 }, 0)
        .to(wrapper[curSlide.current ?? 0] as any, { yPercent: offset }, 0)
        .from(wrapper[next.current] as any, { yPercent: -offset }, 0)
        .set(wrapper[curSlide.current ?? 0] as any, { yPercent: 0 });
      // .add(revealSectionHeading(), ">-1")
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
      // window.removeEventListener("touchstart", handleTouchStart);
      // window.removeEventListener("touchmove", handleTouchMove);
      // window.removeEventListener("touchend", handleTouchEnd);
    };
  });

  return (
    <>
      <Navbar />
      <SidePag
        isSliding={isSliding}
        quantity={3}
        duration={duration}
        slideTo={slideTo.current}
      />

      <section>
        <div className="outer bg-white dark:bg-black">
          <div className="inner">
            <div className="wrapper">
              <HeroSection stateFirstSectionRef={stateFirstSectionRef} />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="outer bg-white dark:bg-black">
          <div className="inner">
            <div className="wrapper">
              <ABSection />
            </div>
          </div>
        </div>
      </section>

      {/* <SceneContainer /> */}

      <section>
        <div className="outer bg-white dark:bg-black">
          <div className="inner">
            <div className="wrapper">
              <Footer />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainPage;
