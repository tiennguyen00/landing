import ABSection from "@/components/ABSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Scene from "@/components/Scene";

export default async function Home() {
  return (
    <main className="w-full overflow-hidden">
      <HeroSection />
      <ABSection />
      <Scene />
      <Footer />
    </main>
  );
}
