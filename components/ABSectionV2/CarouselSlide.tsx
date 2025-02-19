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
  }, [data]);

  // Function to dynamically scale items based on drag position

  useGSAP(() => {
    if (!tlState) return;

    let lastX = 0;
    let velocity = 0;
    let momentumAnimation: gsap.core.Tween | null = null;

    const items = gsap.utils.toArray(".horizontal-item") as HTMLElement[];

    function scaleItems(dragX: number) {
      const centerX = window.innerWidth / 2; // Get screen center
      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2; // Get item center

        // Calculate distance from center
        const distance = Math.abs(centerX - itemCenter);

        // Normalize distance (closer = bigger scale, farther = smaller)
        const scaleFactor = gsap.utils.clamp(1, 1.4, 1.4 - distance / 1000);

        // Apply scaling
        gsap.to(item, {
          scale: scaleFactor,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    }

    Draggable.create(".drag-proxy", {
      type: "x",
      trigger: ".horizontal-item",
      onPress() {
        this.startProgress = tlState?.progress();
        this.startX = this.x;
        lastX = this.x;
        velocity = 0;

        // Kill previous momentum animation (if any) when new drag starts
        if (momentumAnimation && momentumAnimation.isActive())
          momentumAnimation.kill();

        // Create swell, shrink effect and skew
        scaleItems(this.x);
      },
      onDrag() {
        const dragDistance = (this.startX - this.x) * 0.0001;
        tlState?.progress(this.startProgress + dragDistance).pause();

        // Calculate velocity (difference between lastX and current X)
        velocity = this.x - lastX;
        lastX = this.x;

        // Create swell, shrink effect
        scaleItems(this.x);
      },
      onDragEnd() {
        const dragDirection = this.startX - this.x > 0 ? "to-r" : "to-l";
        // Apply momentum effect based on velocity
        const momentumDistance = velocity * 0.01; // Scale velocity effect
        const targetProgress = gsap.utils.clamp(
          0,
          1,
          tlState.progress() - momentumDistance
        );

        console.log("Velocity:", velocity, "New Progress:", targetProgress);
        momentumAnimation = gsap.to(tlState, {
          progress: targetProgress,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            if (dragDirection === "to-l") {
              timelineRef.current?.timeScale(1);
              timelineRef.current?.play();
              tlState?.reverse();
            } else if (dragDirection === "to-r") {
              timelineRef.current?.timeScale(-1);
              tlState?.play();
            }
          },
        });

        // Create swell, shrink effect
        gsap.to(items, {
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      },
    });
  }, [tlState]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="w-full flex space-x-2 relative overflow-auto no-scrollbar">
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
