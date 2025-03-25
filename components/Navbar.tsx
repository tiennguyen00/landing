"use client";
import { useEffect } from "react";
import TogleTheme from "./ToggleTheme";
import Image from "next/image";
import { useTheme } from "@/app/providers";
import Link from "next/link";

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
    <>
      <div className="fixed z-10 top-4 md:inset-x-12 lg:inset-x-20 w-full md:w-auto">
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
      <div className="fixed z-10 bottom-6 right-6">
        <Link href="https://github.com/tiennguyen00" target="_blank">
          <Image src="/img/github.png" width={30} height={30} alt="github" />
        </Link>
      </div>
    </>
  );
};

export default Navbar;
