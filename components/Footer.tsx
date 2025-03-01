import { Send } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useWindowSize } from "@/utils/useScree";
import { useGSAP } from "@gsap/react";

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
  const headlineRef = useRef<HTMLDivElement>(null);

  // useGSAP(() => {
  //   gsap.fromTo(
  //     headlineRef.current,
  //     {
  //       opacity: 0,
  //       y: 100,
  //       scale: 0.8,
  //     },
  //     {
  //       opacity: 1,
  //       y: 0,
  //       scale: 1,
  //       stagger: 0.2,
  //       ease: "power3.out",
  //       scrollTrigger: {
  //         trigger: headlineRef.current,
  //         start: "top 75%",
  //         end: "bottom 25%",
  //         scrub: 1,
  //       },
  //     }
  //   );

  //   const boxes = gsap.utils.toArray(".animated-box"); // Select all elements with this class

  //   gsap.to(boxes, {
  //     y: () => gsap.utils.random(-20, 20), // Moves down
  //     duration: 1.2,
  //     ease: "sine.inOut",
  //     repeat: -1,
  //     yoyo: true,
  //     stagger: 0.3,
  //   });

  //   const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
  //   tl.to(boxes, {
  //     rotation: 360,
  //     duration: 1.5,
  //     ease: "power2.inOut",
  //   });
  // }, [widthScreen]);

  // const handleMouseMove = (e: any) => {
  //   const elemen = headlineRef.current;
  //   if (!elemen) return;

  //   const { left, top, height, width } = elemen.getBoundingClientRect();

  //   const relativeX = (e.clientX - left) / width;
  //   const relativeY = (e.clientY - top) / height;

  //   const tiltX = (relativeY - 0.5) * 20;
  //   const tiltY = (relativeX - 0.5) * -20;

  //   gsap.to(elemen, {
  //     rotateY: tiltY,
  //     rotateX: tiltX,
  //     translateZ: (relativeY - 0.5) * 50,
  //     transformPerspective: 700,
  //     ease: "power3.out",
  //     duration: 0.5,
  //   });
  // };

  // const handleMouseLeave = () => {
  //   const elemen = headlineRef.current;
  //   if (!elemen) return;

  //   gsap.to(elemen, {
  //     rotateY: 0,
  //     rotateX: 0,
  //     translateZ: 0,
  //     ease: "power3.out",
  //     duration: 0.5,
  //   });
  // };

  return (
    <footer className="px-0 min-h-[100dvh] pt-24 pb-12 w-screen bg-[url('/img/footer-bg.webp')] bg-cover bg-center flex flex-col justify-center items-center">
      <div className="flex flex-col items-center sm:flex-row justify-around max-w-[1400px] mx-auto w-full">
        <div className="flex w-3/5 sm:w-auto">
          <img
            src="https://www.maison-ghibli.com/modules/blockreassurance/views/img/img_perso/reassurance-1.png"
            alt=""
          />
          <div className="flex justify-center flex-col font-notosans">
            <p className="font-bold">Fast delivery</p>
            <p>Shipping within 48 hours</p>
          </div>
        </div>
        <div className="flex w-3/5 sm:w-auto">
          <img
            src="https://www.maison-ghibli.com/modules/blockreassurance/views/img/img_perso/reassurance-2.png"
            alt=""
          />
          <div className="flex justify-center flex-col font-notosans">
            <p className="font-bold">Official Ghibli license.</p>
            <p>Manufacturing and importation</p>
          </div>
        </div>
        <div className="flex w-3/5 sm:w-auto">
          <img
            src="https://www.maison-ghibli.com/modules/blockreassurance/views/img/img_perso/reassurance-3.png"
            alt=""
          />
          <div className="flex justify-center flex-col font-notosans">
            <p className="font-bold">2 year warranty</p>
            <p>Pour tous nos produits</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row  items-center justify-center max-w-[1400px] my-8 mx-auto w-full ">
        <div className="w-fit h-fit flex sm:flex-row flex-col items-center mb-10 sm:mb-0">
          <div
            className="flex flex-col items-center text-center headline-container dark:text-white transform-none sm:transform-gpu opacity-100 "
            ref={headlineRef}
            // onMouseMove={handleMouseMove}
            // onMouseLeave={handleMouseLeave}
          >
            <h1 className="text-black relative text-[16px] md:text-[18px] font-medium">
              Explore worlds, beloved characters, and stories
              <div className="bg-transparent absolute hidden sm:block left-0 top-0 -translate-x-[calc(100%+15px)] dark:bg-white w-[50px] h-[50px] rounded-full">
                <Image
                  src="/img/kuro02.svg"
                  alt="ghibli-logo"
                  className="translate-y-1  animated-box"
                  width={50}
                  height={50}
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

          <div className="flex w-[313px] relative flex-col justify-center font-notosans">
            <div className="bg-transparent absolute hidden sm:block right-0 bottom-0 translate-x-[calc(100%+15px)] -translate-y-1/4 dark:bg-white w-[50px] h-[50px] rounded-full">
              <Image
                src="/img/kuro02.svg"
                alt="ghibli-logo"
                className="translate-y-1  animated-box"
                width={50}
                height={50}
              />
              <div className="absolute top-0 left-full flex items-center translate-x-4 justify-center w-fit px-2 pl-3 py-2 bg-white border-2 border-black rounded-xl">
                <p className="truncate text-[16px] md:text-[18px] font-medium text-black">
                  Let explore
                </p>
                <div className="absolute left-0 top-1/2 -translate-x-[10.5px] -translate-y-1/2 w-5 h-5 bg-white border-l-2 border-b-2 border-black rotate-[45deg]"></div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <img src="/img/letter.png" width={55} height={55} alt="" />
              <p className="text-[20px] font-semibold text-[#58585C] ">
                NEWSLETTER
              </p>
            </div>
            <div className="flex relative w-full border-[3px] border-[#845b4f] pr-10 py-2 pl-2 rounded-md bg-[#cf9e2a] mb-3">
              <input
                className="bg-transparent w-full outline-hidden placeholder:text-[#58585C]"
                placeholder="Your email address"
              />
              <button className="absolute right-0 top-0 w-10 h-full ">
                <Send className="text-white m-auto transform transition-transform duration-300" />
              </button>
            </div>
            <p className="text-sm">
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
            {information.map((i) => (
              <li
                key={i}
                className="hover:text-gray-600 cursor-pointer hover:underline mb-1"
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
            {account.map((i) => (
              <li
                key={i}
                className="hover:text-gray-600 cursor-pointer hover:underline mb-1"
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
            {maison.map((i) => (
              <li
                key={i}
                className="hover:text-gray-600 cursor-pointer hover:underline mb-1"
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
