import { useGSAP } from "@gsap/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import gsap from "gsap";
import Image from "next/image";

interface Film {
  description: string;
  director: string;
  id: string;
  image: string;
  locations: string[];
  movie_banner: string;
  original_title: string;
  original_title_romanised: string;
  people: string[];
  producer: string;
  release_date: string; // or number if you prefer to convert it
  rt_score: string; // or number if you prefer to convert it
  running_time: string; // or number if you prefer to convert it
  species: string[];
  title: string;
  url: string;
}

const FilmCard = ({ film }: { film: Film }) => {
  return (
    <div className="relative cursor-pointer horizontalItem">
      <Image
        src={film.image}
        alt=""
        width={600}
        height={900}
        layout="responsive"
        style={{
          minWidth: "200px",
        }}
      />
    </div>
  );
};

const FilmContainer = () => {
  const { data } = useQuery({
    queryKey: ["films"],
    queryFn: async () =>
      axios("https://ghibliapi.vercel.app/films", {
        method: "GET",
      }).then((res) => {
        return res.data as Film[];
      }),
  });

  useGSAP(
    () => {
      // Memoize the selector result
      const items = gsap.utils.toArray(".horizontalItem");
      if (items.length === 0) return;

      // Extract configuration to a constant or prop
      const config = {
        speed: 1,
        repeat: -1,
        paddingRight: 25,
        paused: false,
        snap: false,
        pixelsPerSecond: 100,
      };

      // Initialize arrays outside the loop for better memory management
      const times: number[] = [];
      const widths: number[] = [];
      const xPercents: number[] = [];
      const curIndex = 0;

      // Create timeline with proper typing
      const tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () =>
          tl.totalTime(tl.rawTime() + tl.duration() * 100),
      });

      // Extract snap function
      const snapFunction =
        config.snap === false
          ? (v: number) => v
          : gsap.utils.snap(config.snap || 1);

      // Pre-calculate initial positions
      const startX = items[0].offsetLeft;

      // Set initial positions with proper typing
      gsap.set(items, {
        xPercent: (i: number, el: Element) => {
          const width = (widths[i] = parseFloat(
            gsap.getProperty(el, "width", "px")
          ));
          xPercents[i] = snapFunction(
            (parseFloat(gsap.getProperty(el, "x", "px")) / width) * 100 +
              gsap.getProperty(el, "xPercent")
          );
          return xPercents[i];
        },
      });

      // Reset x position
      gsap.set(items, { x: 0 });

      // Calculate total width more efficiently
      const totalWidth = calculateTotalWidth(
        items,
        xPercents,
        widths,
        startX,
        config.paddingRight
      );

      // Create animations
      createAnimations(items, tl, {
        totalWidth,
        startX,
        xPercents,
        widths,
        times,
        snapFunction,
        pixelsPerSecond: config.speed * config.pixelsPerSecond,
      });

      // Add navigation methods
      addTimelineNavigation(tl, times, items.length, curIndex);

      // Pre-render for performance
      tl.progress(1, true).progress(0, true);

      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }

      // Cleanup function
      return () => {
        tl.kill();
      };
    },
    {
      dependencies: [data],
    }
  );

  // Helper functions
  function calculateTotalWidth(
    items: Element[],
    xPercents: number[],
    widths: number[],
    startX: number,
    paddingRight: number
  ): number {
    const lastIndex = items.length - 1;
    const lastItem = items[lastIndex];

    return (
      lastItem.offsetLeft +
      (xPercents[lastIndex] / 100) * widths[lastIndex] -
      startX +
      lastItem.offsetWidth * gsap.getProperty(lastItem, "scaleX") +
      (parseFloat(paddingRight?.toString()) || 0)
    );
  }

  function createAnimations(
    items: Element[],
    timeline: gsap.core.Timeline,
    config: {
      totalWidth: number;
      startX: number;
      xPercents: number[];
      widths: number[];
      times: number[];
      snapFunction: (v: number) => number;
      pixelsPerSecond: number;
    }
  ) {
    items.forEach((item, i) => {
      const curX = (config.xPercents[i] / 100) * config.widths[i];
      const distanceToStart = item.offsetLeft + curX - config.startX;
      const distanceToLoop =
        distanceToStart + config.widths[i] * gsap.getProperty(item, "scaleX");

      timeline
        .to(
          item,
          {
            xPercent: config.snapFunction(
              ((curX - distanceToLoop) / config.widths[i]) * 100
            ),
            duration: distanceToLoop / config.pixelsPerSecond,
          },
          0
        )
        .fromTo(
          item,
          {
            xPercent: config.snapFunction(
              ((curX - distanceToLoop + config.totalWidth) / config.widths[i]) *
                100
            ),
          },
          {
            xPercent: config.xPercents[i],
            duration:
              (config.totalWidth - distanceToLoop) / config.pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / config.pixelsPerSecond
        )
        .add(`label${i}`, distanceToStart / config.pixelsPerSecond);

      config.times[i] = distanceToStart / config.pixelsPerSecond;
    });
  }

  function addTimelineNavigation(
    timeline: gsap.core.Timeline,
    times: number[],
    length: number,
    curIndex: number
  ) {
    const toIndex = (index: number, vars: gsap.TweenVars = {}) => {
      if (Math.abs(index - curIndex) > length / 2) {
        index += index > curIndex ? -length : length;
      }

      const newIndex = gsap.utils.wrap(0, length, index);
      let time = times[newIndex];

      if (time > timeline.time() !== index > curIndex) {
        vars.modifiers = { time: gsap.utils.wrap(0, timeline.duration()) };
        time += timeline.duration() * (index > curIndex ? 1 : -1);
      }

      curIndex = newIndex;
      vars.overwrite = true;
      return timeline.tweenTo(time, vars);
    };

    Object.assign(timeline, {
      next: (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars),
      previous: (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars),
      current: () => curIndex,
      toIndex: (index: number, vars?: gsap.TweenVars) => toIndex(index, vars),
      times,
    });
  }

  return (
    <div className="flex gap-6 no-scrollbar overflow-auto flex-1 items-center">
      {data?.map((film) => (
        <FilmCard key={film.id} film={film} />
      ))}
    </div>
  );
};

export default FilmContainer;
