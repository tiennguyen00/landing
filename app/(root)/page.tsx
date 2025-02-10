import ABSection from "@/components/ABSection";
import HeroSection from "@/components/HeroSection";

export default async function Home() {
  return (
    <main className="w-full overflow-hidden">
      <HeroSection />
      <ABSection />
    </main>
  );
}
