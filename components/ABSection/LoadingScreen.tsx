import { useTheme } from "@/app/providers";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useWindowSize } from "@/utils/useScree";

interface LoadingScreenProps {
  total: number;
}

const LoadingScreen = ({ total }: LoadingScreenProps) => {
  const { theme } = useTheme();
  const { width } = useWindowSize();
  const [isComplete, setIsComplete] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const loaderIconRef = useRef<HTMLDivElement>(null);

  const progress = (total / 21) * 100;

  useGSAP(() => {
    if (width < 560) {
      if (total >= 21) setIsComplete(true);
    } else {
      const animationConfig = {
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          if (total >= 21) {
            setIsComplete(true);
          }
        },
      };

      gsap.to(loaderIconRef.current, {
        left: `${progress}%`,
        ...animationConfig,
      });

      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        ...animationConfig,
      });
    }
  }, [total, width]);

  return (
    <div
      className={cn(
        "fixed bg-white dark:bg-black z-[999] w-full h-full",
        "flex justify-center items-center px-10",
        isComplete && "hidden"
      )}
    >
      <div className="relative flex justify-center w-full h-2">
        <div
          ref={progressBarRef}
          className="h-full hidden sm:block absolute left-0 rounded-full bg-[#6A4C93] dark:bg-[#9BEF82]"
        />
        <div
          ref={loaderIconRef}
          className={cn(
            "absolute  -translate-y-1/2 pt-6 w-fit",
            theme === "dark" && "bg-white"
          )}
        >
          <p className="text-black absolute top-0 left-1/2 -translate-x-1/2">
            {progress.toFixed(2)}%
          </p>
          <Image
            src="/img/loading.gif"
            alt="Loading indicator"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
