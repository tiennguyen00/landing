import MainPage from "@/components/MainPage";
import ClientOnly from "@/components/shared/ClientOnly";

export default async function Home() {
  return (
    // <ClientOnly fallback={<div className="w-full min-h-screen" />}>
    <MainPage />
    // </ClientOnly>
  );
}
