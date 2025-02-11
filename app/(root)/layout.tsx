"use client";
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("../../components/Scene"));

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-parkinsans bg-white dark:bg-black">
      {children}
      <Scene />
    </main>
  );
}
