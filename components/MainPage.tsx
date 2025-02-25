"use client";
import Footer from "./Footer";
import HeroSection from "./HeroSection";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import Navbar from "./Navbar";
import SidePag from "./SidePag";
import { useSlideStore } from "@/app/store";
import SceneContainer from "./Scene";
import ABSectionV2 from "./ABSectionV2";
import ABSection from "./ABSection";

export interface StateSection {
  tl: gsap.core.Timeline | null;
  progress: "start" | "end";
}

const MainPage = () => {
  const curSlide = useRef<number | null>(null);
  const next = useRef(0);
  const listening = useRef(false);
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

  const [isSliding, setIsSliding] = useState<number | undefined>(undefined);
  const stateFirstSectionRef = useRef<StateSection>({
    tl: null,
    progress: "start",
  });
  const { setIndex, setDirection, setListening } = useSlideStore();

  useGSAP(() => {
    const sections = document.querySelectorAll("section");
    const outerWrappers = gsap.utils.toArray(".outer");
    const innerWrappers = gsap.utils.toArray(".inner");
    const wrapper = gsap.utils.toArray(".wrapper");

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

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
      if (touch.current.dy <= 150 && touch.current.dy >= -150) return;
      if (touch.current.dy > 150) direction.current = "up";
      if (touch.current.dy < -150) direction.current = "down";
      setDirection(direction.current);
      handleDirection();
    }
    // Handle the event
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

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
        })
        .to(outerWrappers[curSlide.current ?? 0] as any, { yPercent: 100 }, 0)
        .to(innerWrappers[curSlide.current ?? 0] as any, { yPercent: -100 }, 0)
        .to(wrapper[curSlide.current ?? 0] as any, { yPercent: offset }, 0)
        .from(wrapper[next.current] as any, { yPercent: -offset }, 0)
        .set(wrapper[curSlide.current ?? 0] as any, { yPercent: 0 });
      // .add(revealSectionHeading(), ">-1")
    }

    slideIn();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  });

  return (
    <>
      <Navbar />
      <SidePag isSliding={isSliding} quantity={3} duration={duration} />

      {/* <section>
        <div className="outer bg-white dark:bg-black">
          <div className="inner">
            <div className="wrapper">
              <HeroSection stateFirstSectionRef={stateFirstSectionRef} />
            </div>
          </div>
        </div>
      </section> */}
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
