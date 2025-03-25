import MainPage from "@/components/MainPage";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense>
      <MainPage />
    </Suspense>
  );
}
