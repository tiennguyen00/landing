"use client";
import { horizontalLoop } from "@/utils";
import { useGSAP } from "@gsap/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";
import { Draggable } from "gsap/Draggable";
import { useWindowSize } from "@/utils/useScree";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { fragmentShader, vertexShader } from "../ABSection/shader";
import * as THREE from "three";

gsap.registerPlugin(Draggable);

const config = {
  speed: 0.4,
  repeat: -1,
  paused: false,
  paddingRight: 8,
  snap: false,
  pixelsPerSecond: 100,
  reversed: false,
};

const Item = ({
  data,
  uniforms,
  ...rest
}: {
  data: Film;
  uniforms: Record<string, THREE.Uniform>;
} & THREE.MeshProps) => {
  const texture = useTexture(data.movie_banner);

  const uniform = useMemo(() => {
    return {
      ...uniforms,
      uTexture: new THREE.Uniform(texture),
      uTextureAspect: new THREE.Uniform(
        texture.image.width / texture.image.height
      ),
    };
  }, [texture]);

  return (
    <mesh {...rest}>
      <planeGeometry args={[2, 3, 15, 15]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniform}
      />
    </mesh>
  );
};

const Experience = ({ dataToShow }: { dataToShow: Film[] }) => {
  const { width } = useWindowSize();
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const dragStartX = useRef(0);
  const direction = useRef(1);

  const uniforms = useMemo(() => {
    return {
      uTime: new THREE.Uniform(0),
      uDirection: new THREE.Uniform(1),
    };
  }, []);

  useGSAP(() => {
    const mapRange = gsap.utils.mapRange(
      0,
      width,
      (-1 * viewport.width) / 2,
      (1 * viewport.width) / 2
    );
    Draggable.create(".drag-proxy", {
      type: "x",
      trigger: ".drag-area",
      onPress(e) {
        dragStartX.current = mapRange(e.clientX);
      },
      onDrag(e) {
        const x = mapRange(e.clientX);
        const deltaX = Math.abs(x - dragStartX.current);
        groupRef.current?.position.add(
          new THREE.Vector3(deltaX * e.movementX * 0.003, 0, 0)
        );
        direction.current = e.movementX;
      },
      onDragEnd() {
        uniforms.uDirection.value = direction.current;
      },
    });
  }, []);

  useFrame(({ state, clock }) => {
    const eslapedTime = clock.getElapsedTime();
    uniforms.uTime.value = eslapedTime;
  });

  return (
    <group ref={groupRef}>
      {dataToShow?.map((i, idx) => (
        <Item
          key={i.id}
          data={i}
          position-x={idx * 2.1}
          position-z={0.01}
          uniforms={uniforms}
        />
      ))}
    </group>
  );
};

const CarouselSlide = () => {
  const { data } = useQuery({
    queryKey: ["films"],
    queryFn: async () =>
      axios("https://ghibliapi.vercel.app/films", {
        method: "GET",
      }).then((res) => {
        return res.data as Film[];
      }),
  });
  const { height } = useWindowSize();

  const fixedWidth = height * 0.35 * (19 / 6);
  const [tlState, setTlState] = useState<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!data) return;
      const items = gsap.utils.toArray(".horizontal-item") as HTMLElement[];
      const tl = horizontalLoop(items, {
        ...config,
        reversed: true,
      });

      setTlState(tl);

      return () => {
        tl.kill();
        tlState?.kill();
      };
    },

    {
      dependencies: [data],
    }
  );

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!data) return;
    const images = gsap.utils.toArray(".horizontal-image") as HTMLElement[];

    const offset =
      ((fixedWidth - Math.max(window.innerWidth * 0.2, 200)) * 100) /
      fixedWidth;

    // Create the timeline once
    if (!timelineRef.current) {
      timelineRef.current = gsap.timeline({
        repeat: -1,
        onUpdate: () => {
          // console.log("Animation progress:", timelineRef.current?.progress());
        },
        onReverseComplete: () => {
          console.log("onReverseComplete");
          timelineRef.current?.timeScale(-1);
          timelineRef.current?.progress(1); // Set progress to end
        },
      });

      timelineRef.current.to(images, {
        x: `-${offset}%`,
        duration: 20,
        ease: "none",
      });
    }

    // Control the timeline based on direction
  }, [data]);

  useGSAP(() => {
    if (!tlState) return;

    let lastX = 0;
    let velocity = 0;
    let momentumAnimation: gsap.core.Tween | null = null;

    Draggable.create(".drag-proxy", {
      type: "x",
      trigger: ".horizontal-item",
      onPress() {
        this.startProgress = tlState?.progress();
        this.startX = this.x;
        lastX = this.x;
        velocity = 0;

        // Kill previous momentum animation (if any) when new drag starts
        if (momentumAnimation && momentumAnimation.isActive())
          momentumAnimation.kill();

        // Create swell, shrink effect and skew
      },
      onDrag() {
        const dragDistance = (this.startX - this.x) * 0.0001;
        tlState?.progress(this.startProgress + dragDistance).pause();

        // Calculate velocity (difference between lastX and current X)
        velocity = this.x - lastX;
        lastX = this.x;

        // Create swell, shrink effect
      },
      onDragEnd() {
        const dragDirection = this.startX - this.x > 0 ? "to-r" : "to-l";
        // Apply momentum effect based on velocity
        const momentumDistance = velocity * 0.01; // Scale velocity effect
        const targetProgress = gsap.utils.clamp(
          0,
          1,
          tlState.progress() - momentumDistance
        );

        momentumAnimation = gsap.to(tlState, {
          progress: targetProgress,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            if (dragDirection === "to-l") {
              timelineRef.current?.timeScale(1);
              timelineRef.current?.play();
              tlState?.reverse();
            } else if (dragDirection === "to-r") {
              timelineRef.current?.timeScale(-1);
              tlState?.play();
            }
          },
        });
      },
    });
  }, [tlState]);

  return (
    <div className="flex-1 flex justify-center items-center">
      {/* <Canvas></Canvas> */}
      <div className="w-full flex bg-red-500 space-x-2 relative overflow-auto py-6 no-scrollbar">
        <div className="absolute invisible drag-proxy" />
        {/* <Canvas
          style={{ width: "100vw", height: "100%" }}
          className="horizontal-item"
        >
          <Experience dataToShow={data?.slice(0, 10)} />
        </Canvas> */}
        {data?.map((film, idx) => (
          <div
            key={film.id}
            className="relative overflow-hidden horizontal-item"
            style={{
              height: `${(fixedWidth * 9) / 16}px`,
            }}
          >
            <Image
              className="absolute h-full aspect-[16/9] horizontal-image"
              style={{
                minWidth: `${fixedWidth}px`,
              }}
              src={film.movie_banner}
              layout="responsive"
              width={1600}
              height={900}
              alt={film.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselSlide;
