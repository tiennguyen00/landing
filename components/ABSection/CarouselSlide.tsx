/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shader";
import { useAspect, useTexture, OrthographicCamera } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import Draggable from "gsap/Draggable";
import gsap from "gsap";
import { useWindowSize } from "@/utils/useScree";

gsap.registerPlugin(Draggable);

const Brush = ({
  mouse,
  max,
  meshes,
}: {
  mouse: THREE.Vector2;
  max: number;
  meshes: THREE.Mesh[];
  meshes: any;
}) => {
  const texture = useTexture("/img/brush.png");
  const { scene } = useThree();

  useEffect(() => {
    for (let i = 0; i < max; i++) {
      const m = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 1, 1), m);
      mesh.rotation.z = Math.random() * Math.PI * 2;
      mesh.visible = false;
      scene.add(mesh);
      meshes.current.push(mesh);
    }
  }, []);

  return <></>;
};

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
  const { width, height } = useWindowSize();
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const prevDragX = useRef(0);
  const direction = useRef(1);
  const dragState = useRef<"idle" | "dragging">("idle");

  const max = 50;
  const mouse = useRef(new THREE.Vector2());
  const prevMouse = useRef(new THREE.Vector2());
  const currentWave = useRef(0);
  const meshes = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX - width / 2;
      mouse.current.y = height / 2 - e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const setNewWave = (x, y, index) => {
    const mesh = meshes.current[index];
    mesh.visible = true;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.scale.x = mesh.scale.y = 1;
    mesh.material.opacity = 1;
  };
  const trackMousePos = () => {
    if (
      Math.abs(mouse.current.x - prevMouse.current.x) < 4 &&
      Math.abs(mouse.current.y - prevMouse.current.y) < 4
    ) {
      // currentMouse.current = mouse.current.x;
    } else {
      currentWave.current = (currentWave.current + 1) % max;
      setNewWave(mouse.current.x, mouse.current.y, currentWave.current);
    }
    prevMouse.current.x = mouse.current.x;
    prevMouse.current.y = mouse.current.y;
  };

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
            deltaX * uniforms.uDirection.value * 20,
          duration: 0.5,
          ease: "power2.out",
        });

        dragState.current = "dragging";
        uniforms.uDelta.value.x = Math.min(deltaX * 50, 80);
      },
      onDragEnd(e) {
        dragState.current = "idle";
      },
    });
  }, []);
  useFrame((state, clock) => {
    trackMousePos();
    meshes.current.forEach((mesh) => {
      if (mesh.visible) {
        mesh.rotation.z += 0.02;
        mesh.material.opacity *= 0.98;
        mesh.scale.x = 0.98 * mesh.scale.x + 0.1;
        mesh.scale.y = mesh.scale.x;
        if (mesh.material.opacity < 0.02) mesh.visible = false;
      }
    });

    uniforms.uTime.value += 0.001 * direction.current;
    groupRef.current?.position.add(new THREE.Vector3(direction.current, 0, 0));

    // Handle infinite loop
    const totalWidth = itemWidth * (dataToShow?.length || 0);
    const threshold = itemWidth; // Define a threshold for when to reposition

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
      if (uniforms.uDelta.value.x > 20) {
        uniforms.uDelta.value.x -= 20;
      } else if (uniforms.uDelta.value.x < -20) {
        uniforms.uDelta.value.x += 20;
      }
    }
  });

  const itemWidth = 300;

  return (
    <>
      <Brush mouse={mouse} max={max} meshes={meshes} />
      <group position-x={-10} ref={groupRef}>
        {dataToShow?.map((i, idx) => (
          <Item
            key={i.id}
            data={i}
            position-x={idx * (itemWidth + 10)}
            itemWidth={itemWidth}
            uniforms={uniforms}
          />
        ))}
      </group>
    </>
  );
};

const CarouselSlide = () => {
  const { width, height } = useWindowSize();
  const frustemSize = 10;
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
        <color args={["#000"]} attach="background" />
        <OrthographicCamera
          makeDefault
          left={width / -2}
          right={width / 2}
          top={height / 2}
          bottom={height / -2}
          near={-1000}
          far={1000}
        />
        <axesHelper />
        <Experience dataToShow={dataToShow} />
      </Canvas>
      <div className="absolute invisible drag-proxy" />
      <div className="fixed w-full h-full flex justify-center items-center bottom-0 drag-area">
        {/* <div className="w-[10%] absolute left-0 h-full bg-gradient-to-l from-transparent to-white dark:to-black"></div>
        <div className="w-[10%] absolute right-0 h-full bg-gradient-to-r from-transparent to-white dark:to-black"></div> */}
      </div>
    </>
  );
};

export default CarouselSlide;
