"use client";
import { useEffect } from "react";
import TogleTheme from "./ToggleTheme";
import Image from "next/image";
import { useTheme } from "@/app/providers";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  return (
    <div className="absolute top-4 md:inset-x-12 lg:inset-x-20 z-20 w-full md:w-auto">
      <nav className="flex items-center justify-between py-1 max-md:px-4">
        <div className="flex items-center gap-2">
          <Image src="/img/logo-dark.svg" width={60} height={60} alt="logo" />
          <div className="font-medium text-[18px] translate-y-1 leading-tight dark:text-white">
            <p className="text-center">スタジオジブリ</p>
            <div className="w-[95%] mx-auto h-1 bg-neutral-900 dark:bg-neutral-50" />
            <p className="tracking-tighter">STUDIO GHIBLI</p>
          </div>
        </div>
        <TogleTheme
          onChange={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        />
      </nav>
    </div>
  );
};

export default Navbar;
