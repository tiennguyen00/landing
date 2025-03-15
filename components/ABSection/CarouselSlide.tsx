/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shader";
import {
  useAspect,
  useTexture,
  OrthographicCamera,
  StatsGl,
  OrbitControls,
} from "@react-three/drei";
import { useMemo, useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useWindowSize } from "@/utils/useScree";
import { useTheme } from "@/app/providers";
import { useFBOManager } from "./useFBOManager";
import CarouselItem from "./Carouseltem";
import Enviroment from "./Enviroment";
const frustemFactor = 0.01;

const Experience = ({ dataToShow }: { dataToShow: Film[] }) => {
  const { width, height } = useWindowSize();
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const prevDragX = useRef(0);
  const direction = useRef(1);
  const dragState = useRef<"idle" | "dragging">("idle");
  const itemRefs = useRef([]);

  // Track which items are active (need FBOs)
  const [activeItems, setActiveItems] = useState<{ [key: number]: boolean }>(
    {}
  );
  // Create FBO manager
  const fboManager = useFBOManager(
    width / 4,
    height / 4,
    width <= 560 ? 2 : undefined
  );
  const setActiveItem = (index: number, active: boolean) => {
    setActiveItems((prev) => ({
      ...prev,
      [index]: active,
    }));
  };

  const itemWidth = 300 * frustemFactor;

  const uniforms = useMemo(() => {
    return {
      uTime: new THREE.Uniform(0),
      uDelta: new THREE.Uniform({
        x: 0,
        y: 0,
      }),
      uDirection: new THREE.Uniform(1),
    };
  }, []);
  const mapRange = gsap.utils.mapRange(
    0,
    width,
    (-1 * viewport.width) / 2,
    (1 * viewport.width) / 2
  );

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevDragX.current = mapRange(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const x = mapRange(e.clientX);
      let deltaX = x - prevDragX.current;
      direction.current = Math.sign(deltaX);
      uniforms.uDirection.value = direction.current;
      deltaX = Math.abs(deltaX);

      gsap.to(groupRef.current!.position, {
        x:
          groupRef.current!.position.x +
          deltaX * uniforms.uDirection.value * 15 * frustemFactor,
        duration: 0.5,
        ease: "power2.out",
      });

      dragState.current = "dragging";
      uniforms.uDelta.value.x = Math.min(deltaX, 0.85);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      dragState.current = "idle";
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useFrame((state, clock) => {
    // Update all items in a single frame
    itemRefs.current.forEach((update) => {
      update(state);
    });

    uniforms.uTime.value += 0.001 * direction.current;
    groupRef.current?.position.add(
      new THREE.Vector3(direction.current * frustemFactor, 0, 0)
    );

    // Handle infinite loop
    const totalWidth = itemWidth * (dataToShow?.length || 0);
    const spacing = 10 * frustemFactor;
    const threshold = itemWidth; // Define a threshold for when to reposition

    // Reposition children when they move too far
    groupRef.current?.children.forEach((child) => {
      const worldPosition = child.getWorldPosition(new THREE.Vector3());

      if (
        direction.current > 0 &&
        worldPosition.x > width * frustemFactor + threshold
      ) {
        // Account for spacing when repositioning
        child.position.x -= totalWidth + spacing * (dataToShow?.length || 0);
      } else if (
        direction.current < 0 &&
        worldPosition.x < -width * frustemFactor - threshold
      ) {
        // Account for spacing when repositioning
        child.position.x += totalWidth + spacing * (dataToShow?.length || 0);
      }
    });

    if (dragState.current === "idle" && uniforms.uDelta.value.x !== 0) {
      if (uniforms.uDelta.value.x > 5 * frustemFactor) {
        uniforms.uDelta.value.x -= 10 * frustemFactor;
      } else if (uniforms.uDelta.value.x < -5 * frustemFactor) {
        uniforms.uDelta.value.x += 10 * frustemFactor;
      }
    }
  });

  const textureBrush = useTexture("/img/brush.png");

  return (
    <group position-x={-6.5} ref={groupRef}>
      {dataToShow?.map((i, idx) => (
        <CarouselItem
          key={i.id}
          itemRefs={itemRefs.current}
          index={idx}
          data={i}
          position-x={idx * (itemWidth + 0.1)}
          itemWidth={itemWidth}
          uniforms={uniforms}
          fboManager={fboManager}
          isActive={!!activeItems[idx]}
          setActiveItem={setActiveItem}
          textureBrush={textureBrush}
          frustemFactor={frustemFactor}
        />
      ))}
    </group>
  );
};

const CarouselSlide = () => {
  const { width, height } = useWindowSize();
  const { data } = useQuery({
    queryKey: ["films"],
    queryFn: async () =>
      axios("https://ghibliapi.vercel.app/films", {
        method: "GET",
      }).then((res) => {
        return res.data as Film[];
      }),
  });

  const dataToShow = data?.slice(0, 20);
  const { theme } = useTheme();

  return (
    <Canvas
      style={{ width: "100%", height: "100vh" }}
      gl={{
        alpha: true,
        antialias: true,
      }}
    >
      <color args={["#05233C"]} attach="background" />
      <StatsGl className="z-[20] fixed" trackGPU />
      {/* <axesHelper args={[5]} /> */}
      <OrbitControls />
      <Enviroment />

      <OrthographicCamera
        makeDefault
        // left={(width * frustemFactor) / -2}
        // right={(width * frustemFactor) / 2}
        // top={(height * frustemFactor) / 2}
        // bottom={(height * frustemFactor) / -2}
        near={-50}
        far={50}
        zoom={120}
      />
      <Experience dataToShow={dataToShow} />
    </Canvas>
  );
};

export default CarouselSlide;
