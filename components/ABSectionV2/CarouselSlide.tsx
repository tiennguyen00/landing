"use client";
import { horizontalLoop } from "@/utils";
import { useGSAP } from "@gsap/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import gsap from "gsap";
import { useRef, useState } from "react";
import { Draggable } from "gsap/Draggable";
import { useWindowSize } from "@/utils/useScree";

gsap.registerPlugin(Draggable);

const config = {
  speed: 0.4,
  repeat: -1,
  paused: false,
  paddingRight: 8,
  snap: false,
  pixelsPerSecond: 100,
  reversed: false,
};

const CarouselSlide = () => {
  const { data } = useQuery({
    queryKey: ["films"],
    queryFn: async () =>
      axios("https://ghibliapi.vercel.app/films", {
        method: "GET",
      }).then((res) => {
        return res.data as Film[];
      }),
  });
  const { height } = useWindowSize();

  const fixedWidth = height * 0.35 * (19 / 6);
  const [direction, setDirection] = useState<"to-l" | "to-r">("to-l");
  const [tlState, setTlState] = useState<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!data) return;
      const items = gsap.utils.toArray(".horizontal-item") as HTMLElement[];
      const tl = horizontalLoop(items, {
        ...config,
        reversed: true,
      });
      setTlState(tl);

      return () => {
        tl.kill();
        tlState?.kill();
      };
    },

    {
      dependencies: [data],
    }
  );

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!data) return;
    const images = gsap.utils.toArray(".horizontal-image") as HTMLElement[];

    const offset =
      ((fixedWidth - Math.max(window.innerWidth * 0.2, 200)) * 100) /
      fixedWidth;

    // Create the timeline once
    if (!timelineRef.current) {
      timelineRef.current = gsap.timeline({
        repeat: -1,
        onUpdate: () => {
          // console.log("Animation progress:", timelineRef.current?.progress());
        },
        onReverseComplete: () => {
          console.log("onReverseComplete");
          timelineRef.current?.timeScale(-1);
          timelineRef.current?.progress(1); // Set progress to end
        },
      });

      timelineRef.current.to(images, {
        x: `-${offset}%`,
        duration: 20,
        ease: "none",
      });
    }

    // Control the timeline based on direction
    if (direction === "to-l") {
      timelineRef.current?.timeScale(1);
      timelineRef.current.play();
      tlState?.reverse();
    } else if (direction === "to-r") {
      timelineRef.current?.timeScale(-1);
      tlState?.play();
    }
  }, [direction, data]);

  useGSAP(() => {
    if (!data) return;
    const iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around - allows us to smoothly continue the playhead scrubbing in the correct direction.

    Draggable.create(".drag-proxy", {
      type: "x",
      trigger: ".horizontal-item",
      onPress() {
        // this.startOffset = scrub.vars.offset;
        console.log("onPress");
      },
      onDrag(e) {
        // scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
        // scrub.invalidate().restart(); // same thing as we do in the ScrollTrigger's onUpdate
        console.log("onDrag");
        console.log(e.x, e.startX);
      },
      onDragEnd() {
        // scrollToOffset(scrub.vars.offset);
        console.log("onDragEnd");
      },
    });
  }, [data]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <div
        className="w-full flex space-x-2 relative overflow-auto no-scrollbar"
        onClick={() => setDirection(direction === "to-r" ? "to-l" : "to-r")}
      >
        <div className="absolute invisible drag-proxy" />
        {data?.map((film) => (
          <div
            key={film.id}
            className="relative overflow-hidden horizontal-item"
            style={{
              height: `${(fixedWidth * 9) / 16}px`,
            }}
          >
            <Image
              className="absolute h-full aspect-[16/9] horizontal-image"
              style={{
                minWidth: `${fixedWidth}px`,
              }}
              src={film.movie_banner}
              layout="responsive"
              width={1600}
              height={900}
              alt={film.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselSlide;
