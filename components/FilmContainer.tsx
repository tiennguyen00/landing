import { useGSAP } from "@gsap/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import gsap from "gsap";
import Image from "next/image";
import { useRef, useState } from "react";
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
      className={cn("group overflow-hidden", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className="h-[calc(min(25vh,500px))] rounded-lg overflow-hidden aspect-[2/3] relative">
        <Image
          src={film.image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <p className="leading-none text-xs max-w-[8vw] text-start truncate sm:text-normal font-bold dark:text-white mt-2">
        {film.title}
      </p>
      <p className="dark:text-white text-start text-xs sm:text-normal">
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
      const tl = horizontalLoop(items, config);
      const tl2 = horizontalLoop(items2, {
        ...config,
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
            tlState2?.play();
          }
          isOpenRef.current = v;
        }}
      >
        <div className="flex flex-1 max-h-[1200px] space-y-4 flex-col max-w-[80%] mx-auto justify-center relative">
          <div className="absolute hidden sm:block h-full w-[100px] right-0 z-10 bg-gradient-to-r from-transparent to-white dark:to-black" />
          <div className="absolute hidden sm:block h-full w-[100px] left-0 z-10 bg-gradient-to-l from-transparent to-white dark:to-black" />
          <div className="flex overflow-auto space-x-4 no-scrollbar">
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

          <div className="flex overflow-auto space-x-4 no-scrollbar">
            {data?.slice(11, 20)?.map((film) => (
              <DialogTrigger key={film.id}>
                <FilmCard
                  film={film}
                  onMouseEnter={() => {
                    tlState2?.pause();
                  }}
                  onMouseLeave={() => {
                    if (!isOpenRef.current) {
                      tlState2?.play();
                    }
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
