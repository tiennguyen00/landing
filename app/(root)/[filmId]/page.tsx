"use client";

import { useEffect, useRef, use } from "react";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FilmId = (props: { params: Promise<{ filmId: string }> }) => {
  const params = use(props.params);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch film data
  const { data: film, isLoading } = useQuery({
    queryKey: ["film", params.filmId],
    queryFn: async () =>
      axios(`https://ghibliapi.vercel.app/films/${params.filmId}`, {
        method: "GET",
      }).then((res) => {
        return res.data as Film;
      }),
  });

  useEffect(() => {
    if (
      !containerRef.current ||
      !imageRef.current ||
      !contentRef.current ||
      isLoading
    )
      return;

    // Create a timeline for coordinated animations
    const tl = gsap.timeline();

    // Initial states - start with the image at the same size as the carousel ended
    gsap.set(containerRef.current, {
      opacity: 1,
    });

    gsap.set(imageRef.current, {
      scale: 1.1, // Start slightly larger
      opacity: 0.95,
      filter: "blur(2px)",
      y: 0,
    });

    gsap.set(contentRef.current, {
      opacity: 0,
      y: 20,
    });

    // Animation sequence - smoother and more subtle
    tl.to(imageRef.current, {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power2.out",
    });

    tl.to(
      contentRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4" // Start content animation earlier
    );
  }, [film, isLoading]);

  const handleBackClick = () => {
    // Animate out before navigation
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => router.back(),
      });
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-black text-white overflow-hidden"
    >
      {film && (
        <>
          {/* Hero image with film banner */}
          <div
            ref={imageRef}
            className="w-full h-[70vh] relative overflow-hidden"
          >
            <Image
              src={film.movie_banner || film.image}
              alt={film.title}
              fill
              className="object-cover"
              priority
            />

            <button
              onClick={handleBackClick}
              className="absolute top-6 left-6 z-10 px-4 py-2 border bg-black cursor-pointer border-white/40 hover:bg-black/40 rounded-full transition-all duration-300"
            >
              ← Back
            </button>
          </div>

          {/* Content section */}
          <div
            ref={contentRef}
            className="container mx-auto px-6 py-10 relative z-10"
          >
            <h1 className="text-5xl font-bold mb-4">{film.title}</h1>
            <h2 className="text-2xl text-gray-300 mb-8">
              {film.original_title}
            </h2>

            <div className="w-full h-1 bg-white/10 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-lg leading-relaxed mb-6">
                  {film.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="px-4 py-2 bg-white/10 rounded-full">
                    {film.release_date}
                  </div>
                  <div className="px-4 py-2 bg-white/10 rounded-full">
                    {film.running_time} min
                  </div>
                  <div className="px-4 py-2 bg-white/10 rounded-full">
                    Director: {film.director}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Film Details</h3>
                <div className="space-y-3">
                  <p>
                    <span className="text-gray-400">Producer:</span>{" "}
                    {film.producer}
                  </p>
                  <p>
                    <span className="text-gray-400">RT Score:</span>{" "}
                    {film.rt_score}
                  </p>
                </div>
              </div>

              <div className="border relative border-white/40 rounded-lg overflow-hidden">
                <Image
                  src={film.image}
                  width={500}
                  height={100}
                  alt={film.title}
                  layout="responsive"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilmId;
