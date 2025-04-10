import { Send } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useWindowSize } from "@/utils/useScree";
import { useGSAP } from "@gsap/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import EarlyAccessModal from "./shared/EarlyAccessModal";
import { useSlideStore } from "@/app/store";

const information = [
  "About us",
  "Legal informations",
  "Our terms of use",
  "Terms of Sales",
  "Delivery",
];
const account = [
  "Personal info",
  "Addresses",
  "Orders",
  "Vouchers",
  "Wishlist",
  "Alerts",
];

const maison = [
  "Official manufacturer and distributor for Studio Ghibli in Europe",
  "37 ter rue Gustave Simonet, 94200 Ivry-Sur-Seine",
  "+33146706605",
  "Contact us",
];
const Footer = () => {
  const { index } = useSlideStore();
  const headlineRef = useRef<HTMLDivElement>(null);
  const kuroRefs = useRef<Array<HTMLImageElement | null>>([]);
  const listItemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const reassuranceRefs = useRef<Array<HTMLDivElement | null>>([]);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const newsletterTitleRef = useRef<HTMLParagraphElement>(null);
  const newsletterInputRef = useRef<HTMLDivElement>(null);
  const newsletterDisclaimerRef = useRef<HTMLParagraphElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!headlineRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } =
      headlineRef.current.getBoundingClientRect();

    const x = (clientX - left - width / 2) / 15;
    const y = (clientY - top - height / 2) / 15;

    gsap.to(headlineRef.current, {
      rotationY: x,
      rotationX: -y,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!headlineRef.current) return;

    gsap.to(headlineRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleNewsletterHover = () => {
    if (!newsletterInputRef.current) return;

    gsap.to(newsletterInputRef.current, {
      scale: 1.02,
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleNewsletterLeave = () => {
    if (!newsletterInputRef.current) return;

    gsap.to(newsletterInputRef.current, {
      scale: 1,
      boxShadow: "none",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  useGSAP(() => {
    console.log(index);
    if (index === 2) {
      // Reset animations first to ensure they replay
      gsap.set(kuroRefs.current, { clearProps: "all" });
      gsap.set(headlineRef.current, { clearProps: "all" });
      gsap.set(reassuranceRefs.current, { clearProps: "all" });
      gsap.set(listItemRefs.current, { clearProps: "all" });
      gsap.set(newsletterRef.current, { clearProps: "all" });
      gsap.set(newsletterTitleRef.current, { clearProps: "all" });
      gsap.set(newsletterInputRef.current, { clearProps: "all" });
      gsap.set(newsletterDisclaimerRef.current, { clearProps: "all" });

      // Floating animation for Kuro sprites
      kuroRefs.current.forEach((kuro) => {
        if (!kuro) return;

        gsap.to(kuro, {
          y: "+=10",
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(kuro, {
          rotate: "+=5",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Animate headline
      gsap.from(headlineRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
      });

      // Animate reassurance elements
      gsap.from(reassuranceRefs.current, {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.7,
        ease: "power3.out",
      });

      // Animate list items immediately on mount instead of on scroll
      gsap.from(listItemRefs.current, {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
      });

      // Animate newsletter section
      gsap.from(newsletterTitleRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.7,
        delay: 0.3,
        ease: "elastic.out(1, 0.3)",
      });

      gsap.from(newsletterInputRef.current, {
        width: "0%",
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out",
      });

      // Pulse animation for newsletter box
      gsap.to(newsletterInputRef.current, {
        boxShadow: "0 0 12px rgba(132, 91, 79, 0.7)",
        duration: 1.5,
        repeat: 1,
        yoyo: true,
        delay: 1.3,
      });

      gsap.from(newsletterDisclaimerRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        delay: 0.7,
      });
    } else {
      // Kill any ongoing animations when not on slide 2
      gsap.killTweensOf(kuroRefs.current);
      gsap.killTweensOf(headlineRef.current);
      gsap.killTweensOf(reassuranceRefs.current);
      gsap.killTweensOf(listItemRefs.current);
      gsap.killTweensOf(newsletterRef.current);
      gsap.killTweensOf(newsletterTitleRef.current);
      gsap.killTweensOf(newsletterInputRef.current);
      gsap.killTweensOf(newsletterDisclaimerRef.current);
    }
  }, [index]);

  return (
    <footer className="px-0 min-h-[100dvh] pt-24 pb-12 w-screen bg-[url('/img/footer-bg.webp')] bg-cover bg-center flex flex-col justify-center items-center">
      <div className="flex flex-col items-center sm:flex-row justify-around max-w-[1400px] mx-auto w-full">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex w-3/5 sm:w-auto"
            ref={(el) => {
              reassuranceRefs.current[index] = el;
            }}
          >
            <img
              src={`https://www.maison-ghibli.com/modules/blockreassurance/views/img/img_perso/reassurance-${
                index + 1
              }.png`}
              alt=""
            />
            <div className="flex justify-center flex-col font-notosans">
              <p className="font-bold">
                {index === 0
                  ? "Fast delivery"
                  : index === 1
                  ? "Official Ghibli license."
                  : "2 year warranty"}
              </p>
              <p>
                {index === 0
                  ? "Shipping within 48 hours"
                  : index === 1
                  ? "Manufacturing and importation"
                  : "Pour tous nos produits"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row  items-center justify-center max-w-[1400px] my-8 mx-auto w-full ">
        <div className="w-fit h-fit flex sm:flex-row flex-col items-center mb-10 sm:mb-0">
          <div
            className="flex flex-col items-center text-center headline-container dark:text-white transform-none sm:transform-gpu opacity-100 "
            ref={headlineRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <h1 className="text-black relative text-[16px] md:text-[18px] font-medium">
              Explore worlds, beloved characters, and stories
              <div className="bg-transparent absolute hidden sm:block left-0 top-0 -translate-x-[calc(100%+15px)] dark:bg-white w-[50px] h-[50px] rounded-full">
                <Image
                  src="/img/kuro02.svg"
                  alt="ghibli-logo"
                  className="translate-y-1 animated-box"
                  width={50}
                  height={50}
                  ref={(el) => {
                    kuroRefs.current[0] = el;
                  }}
                />
                <div className="absolute hidden top-0 right-full sm:flex items-center -translate-x-4 justify-center w-fit px-2 pr-3 py-1 bg-white border-2 border-black rounded-xl">
                  <p className="truncate text-black text-[16px] md:text-[18px]">
                    Wass new
                  </p>
                  <div className="absolute right-0 top-1/2 translate-x-[10.5px] -translate-y-1/2 w-5 h-5 bg-white border-l-2 border-b-2 border-black rotate-[225deg]"></div>
                </div>
              </div>
            </h1>

            <h1 className="md:text-[3rem] mb-2 relative text-[2.5rem] font-bold leading-none headline text-black">
              Step Into the <br /> Ghibli Universe
            </h1>
          </div>

          <div
            className="flex w-[313px] relative flex-col justify-center font-notosans"
            ref={newsletterRef}
          >
            <div className="bg-transparent absolute hidden sm:block right-0 bottom-0 translate-x-[calc(100%+15px)] -translate-y-1/4 dark:bg-white w-[50px] h-[50px] rounded-full">
              <Image
                src="/img/kuro02.svg"
                alt="ghibli-logo"
                className="translate-y-1 animated-box"
                width={50}
                height={50}
                ref={(el) => {
                  kuroRefs.current[1] = el;
                }}
              />
              <div className="absolute top-0 left-full flex items-center translate-x-4 justify-center w-fit px-2 pl-3 py-2 bg-white border-2 border-black rounded-xl">
                <p className="truncate text-[16px] md:text-[18px] font-medium text-black">
                  Let explore
                </p>
                <div className="absolute left-0 top-1/2 -translate-x-[10.5px] -translate-y-1/2 w-5 h-5 bg-white border-l-2 border-b-2 border-black rotate-[45deg]"></div>
              </div>
            </div>
            <div
              ref={newsletterTitleRef}
              className="flex items-center gap-2 mb-1"
            >
              <img
                src="/img/letter.png"
                width={55}
                height={55}
                alt=""
                className="animate-bounce-slow"
              />
              <p className="text-[20px] font-semibold text-[#58585C]">
                NEWSLETTER
              </p>
            </div>
            <div
              ref={newsletterInputRef}
              className="flex relative w-full border-[3px] border-[#845b4f] pr-10 py-2 pl-2 rounded-md bg-[#cf9e2a] mb-3"
            >
              <Input
                className="bg-transparent font-bold !focus-visible:outline-none focus-visible:ring-0 outline-none border-none w-full outline-hidden placeholder:text-black"
                placeholder="Your email address"
              />

              <EarlyAccessModal>
                <Button className="absolute right-1 top-0 !bg-transparent h-full !px-0 [&_svg]:size-8 hover:scale-110 transition-transform">
                  <Send className="animate-pulse-slow" />
                </Button>
              </EarlyAccessModal>
            </div>
            <p className="text-sm" ref={newsletterDisclaimerRef}>
              You may unsubscribe at any moment. For that purpose, please find
              our contact info in the legal notice.
            </p>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex flex-wrap sm:justify-around font-notosans max-w-[1200px] w-full px-4 pb-6 mx-auto">
        <div className="flex flex-col min-w-[200px] sm:min-w-auto flex-1">
          <div className="flex items-center gap-2 mb-1">
            <img src="/img/info.png" alt="" />
            <p className="font-bold uppercase">Informations</p>
          </div>
          <ul className="font-bold">
            {information.map((i, index) => (
              <li
                key={i}
                className="hover:text-gray-600 cursor-pointer hover:underline mb-1 hover:translate-x-1 transition-transform duration-200"
                ref={(el) => {
                  listItemRefs.current[index] = el;
                }}
              >
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col min-w-[200px] sm:min-w-auto  flex-1">
          <div className="flex items-center gap-2 mb-1">
            <img src="/img/h1.png" alt="" />
            <p className="font-bold uppercase">Your account</p>
          </div>
          <ul className="font-bold">
            {account.map((i, index) => (
              <li
                key={i}
                className="hover:text-gray-600 cursor-pointer hover:underline mb-1 hover:translate-x-1 transition-transform duration-200"
                ref={(el) => {
                  listItemRefs.current[index + information.length] = el;
                }}
              >
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col min-w-[200px] sm:min-w-auto flex-1">
          <div className="flex items-center gap-2 mb-1">
            <img src="/img/h2.png" alt="" />
            <p className="font-bold uppercase">Maison ghibli</p>
          </div>
          <ul className="font-bold">
            {maison.map((i, index) => (
              <li
                key={i}
                className="hover:text-gray-600 cursor-pointer hover:underline mb-1 hover:translate-x-1 transition-transform duration-200"
                ref={(el) => {
                  listItemRefs.current[
                    index + information.length + account.length
                  ] = el;
                }}
              >
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full bg-black hidden sm:block text-white font-notosans py-1 text-center font-bold">
        © Semic Distribution - Maison Ghibli is a registered trademark -
        realised by WebXY
      </div>
    </footer>
  );
};

export default Footer;
