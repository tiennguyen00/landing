"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shader";
import { useAspect, useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import Draggable from "gsap/Draggable";
import gsap from "gsap";
import { useWindowSize } from "@/utils/useScree";

gsap.registerPlugin(Draggable);

const Item = ({
  data,
  uniforms,
  itemWidth,
  ...rest
}: {
  data: Film;
  uniforms: Record<string, THREE.Uniform>;
  itemWidth: number;
} & THREE.MeshProps) => {
  const texture = useTexture(data.movie_banner);
  const scale = useAspect(texture.image.width, texture.image.height, 1);

  const uniform = useMemo(() => {
    return {
      ...uniforms,
      uTexture: new THREE.Uniform(texture),
      uTextureAspect: new THREE.Uniform(2000 / 683),
    };
  }, [texture]);

  return (
    <mesh {...rest}>
      <planeGeometry args={[itemWidth, itemWidth * 1.5, 15, 15]} />
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
  const prevDragX = useRef(0);
  const direction = useRef(1);
  const dragState = useRef<"idle" | "dragging">("idle");

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

  useGSAP(() => {
    Draggable.create(".drag-proxy", {
      type: "x",
      trigger: ".drag-area",
      onPress(e) {
        prevDragX.current = mapRange(e.clientX);
      },
      onDrag(e) {
        const x = mapRange(e.clientX);
        let deltaX = x - prevDragX.current;
        direction.current = Math.sign(deltaX);
        uniforms.uDirection.value = direction.current;
        deltaX = Math.abs(deltaX);

        gsap.to(groupRef.current!.position, {
          x:
            groupRef.current!.position.x +
            deltaX * uniforms.uDirection.value * 0.3,
          duration: 0.5,
          ease: "power2.out",
        });

        dragState.current = "dragging";
        uniforms.uDelta.value.x = Math.min(deltaX, 2.0);
      },
      onDragEnd(e) {
        dragState.current = "idle";
      },
    });
  }, []);

  useFrame((state, clock) => {
    uniforms.uTime.value += 0.001 * direction.current;
    groupRef.current?.position.add(
      new THREE.Vector3(0.005 * direction.current, 0, 0)
    );

    // Handle infinite loop
    const totalWidth = itemWidth * (dataToShow?.length || 0);
    const threshold = itemWidth * 2; // Define a threshold for when to reposition

    // Reposition children when they move too far
    groupRef.current?.children.forEach((child) => {
      const worldPosition = child.getWorldPosition(new THREE.Vector3());

      if (
        direction.current > 0 &&
        worldPosition.x > viewport.width + threshold
      ) {
        // If moving right and item is too far right, move it to the leftmost position
        child.position.x -= totalWidth;
      } else if (
        direction.current < 0 &&
        worldPosition.x < -viewport.width - threshold
      ) {
        // If moving left and item is too far left, move it to the rightmost position
        child.position.x += totalWidth;
      }
    });

    if (dragState.current === "idle" && uniforms.uDelta.value.x !== 0) {
      if (uniforms.uDelta.value.x > 0.1) {
        uniforms.uDelta.value.x -= 0.1;
      } else if (uniforms.uDelta.value.x < -0.1) {
        uniforms.uDelta.value.x += 0.1;
      }
    }
  });

  const itemWidth = 3;

  return (
    <group position-x={-10} ref={groupRef}>
      {dataToShow?.map((i, idx) => (
        <Item
          key={i.id}
          data={i}
          position-x={idx * (itemWidth + 0.05)}
          itemWidth={itemWidth}
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

  const dataToShow = data?.slice(0, 20);

  return (
    <>
      <Canvas style={{ width: "100%", height: "100vh" }}>
        <axesHelper />
        <Experience dataToShow={dataToShow} />
      </Canvas>
      <div className="absolute invisible drag-proxy" />
      <div className="fixed w-full h-[75%] flex justify-center items-center bottom-0 drag-area">
        <div className="w-[10%] absolute left-0 h-full bg-gradient-to-l from-transparent to-white dark:to-black"></div>
        <div className="w-[10%] absolute right-0 h-full bg-gradient-to-r from-transparent to-white dark:to-black"></div>
      </div>
    </>
  );
};

export default CarouselSlide;
