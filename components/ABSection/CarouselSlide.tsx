"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shader";
import { useAspect, useTexture } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
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
  const dragStartX = useRef(0);
  const [direction, setDirection] = useState(1);
  const dragState = useRef<"idle" | "dragging">("idle");

  const uniforms = useMemo(() => {
    return {
      uTime: new THREE.Uniform(0),
      uDirection: new THREE.Uniform(1),
      uDelta: new THREE.Uniform({
        x: 0,
        y: 0,
      }),
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

        gsap.to(groupRef.current!.position, {
          x:
            groupRef.current!.position.x +
            deltaX * Math.sign(e.movementX) * 0.3,
          duration: 0.5,
          ease: "power2.out",
        });

        // groupRef.current?.position.add(
        //   new THREE.Vector3(deltaX * Math.sign(e.movementX) * 0.03, 0, 0)
        // );

        dragState.current = "dragging";
        uniforms.uDelta.value.x =
          Math.min(deltaX, 2.0) * -Math.sign(e.movementX);
        if (e.movementX !== 0) setDirection(-Math.sign(e.movementX));
      },
      onDragEnd() {
        dragState.current = "idle";
      },
    });
  }, []);

  useFrame((state, clock) => {
    uniforms.uTime.value += 0.01 * direction;
    groupRef.current?.position.add(new THREE.Vector3(-0.005 * direction, 0, 0));

    // Handle infinite loop
    const totalWidth = itemWidth * dataToShow?.length;

    // Reposition children when they move too far
    groupRef.current?.children.forEach((child) => {
      const worldPosition = child.getWorldPosition(new THREE.Vector3());

      if (direction > 0 && worldPosition.x < -itemWidth * 10) {
        // If moving left and item is too far left, move it to the right end
        child.position.x += totalWidth;
      } else if (
        direction < 0 &&
        worldPosition.x > itemWidth * (dataToShow.length - 10)
      ) {
        // If moving right and item is too far right, move it to the left end
        child.position.x -= totalWidth;
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
      <div className="fixed w-full h-full flex justify-center items-center drag-area"></div>
    </>
  );
};

export default CarouselSlide;
