import { useGSAP } from "@gsap/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { horizontalLoop } from "@/utils";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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

const config = {
  speed: 1,
  repeat: -1,
  paddingRight: 25,
  paused: false,
  snap: 1,
  pixelsPerSecond: 100,
  reversed: false,
};

const FilmCard = ({
  film,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
}: {
  film: Film;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className: string;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn("cursor-pointer h-fit my-auto group ", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className="overflow-hidden  relative w-[150px] sm:w-[200px] h-[200px] sm:h-[300px] rounded-xl mb-1">
        <div className="absolute inset-0 bg-black/50 p-1 overflow-auto group-hover:opacity-100 opacity-0 transition-opacity duration-300">
          <p className="text-white leading-tight font-sm">{film.description}</p>
        </div>
        <Image
          src={film.image}
          alt=""
          width={600}
          height={900}
          layout="responsive"
          className="w-full h-full"
        />
      </div>
      <p className="leading-none text-xs sm:text-normal font-bold dark:text-white">
        {film.title}
      </p>
      <p className=" dark:text-white text-xs sm:text-normal ">
        Release Date: {film.release_date}
      </p>
    </div>
  );
};

const FilmContainer = () => {
  const [tlState, setTlState] = useState<gsap.core.Timeline | null>(null);
  const [tlState2, setTlState2] = useState<gsap.core.Timeline | null>(null);
  const isOpenRef = useRef(false);

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
      if (!data) return;
      const items = gsap.utils.toArray(".horizontalItem") as HTMLElement[];
      const items2 = gsap.utils.toArray(".horizontalItem2") as HTMLElement[];
      if (items.length === 0 || items2.length === 0) return;
      const tl = horizontalLoop(items, config);
      const tl2 = horizontalLoop(items2, {
        ...config,
        reversed: true,
        speed: 0.8,
      });

      setTlState(tl);
      setTlState2(tl2);

      return () => {
        tl.kill();
        tl2.kill();
      };
    },
    {
      dependencies: [data],
    }
  );

  return (
    <>
      <Dialog
        onOpenChange={(v) => {
          if (!v) {
            tlState?.play();
            tlState2?.reverse();
          }
          isOpenRef.current = v;
        }}
      >
        <div className="flex flex-1 flex-col max-w-7xl mx-auto justify-center sm:space-y-10 relative ">
          <div className="absolute h-full w-[100px] right-0 z-10 bg-gradient-to-r from-transparent to-white dark:to-black" />
          <div className="absolute h-full w-[100px] left-0 z-10 bg-gradient-to-l from-transparent to-white dark:to-black" />
          <div className="flex gap-x-6 overflow-auto no-scrollbar">
            {data?.slice(0, 10)?.map((film) => (
              <DialogTrigger key={film.id}>
                <FilmCard
                  film={film}
                  onMouseEnter={() => {
                    tlState?.pause();
                  }}
                  onMouseLeave={() => {
                    if (!isOpenRef.current) {
                      tlState?.play();
                    }
                  }}
                  onClick={() => {
                    tlState?.pause();
                  }}
                  className="horizontalItem"
                />
              </DialogTrigger>
            ))}
          </div>

          <div className="flex gap-x-6 overflow-auto no-scrollbar">
            {data?.slice(10, 21)?.map((film) => (
              <DialogTrigger key={film.id}>
                <FilmCard
                  film={film}
                  onMouseEnter={() => {
                    tlState2?.pause();
                  }}
                  onMouseLeave={() => {
                    if (!isOpenRef.current) tlState2?.reverse();
                  }}
                  onClick={() => {
                    tlState2?.pause();
                  }}
                  className="horizontalItem2"
                />
              </DialogTrigger>
            ))}
          </div>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilmContainer;
