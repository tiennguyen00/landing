"use client";
import { Can+vas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Scene() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctxCanvas, setCtxCanvas] = useState<CanvasRenderingContext2D>();
  const textureCanvas = useRef<THREE.CanvasTexture>(null);

  // Create canvas2D
  useEffect(() => {
    const canvas2D = document.createElement("canvas"),
      width = window.innerWidth * window.devicePixelRatio,
      height = window.innerHeight * window.devicePixelRatio;
    setCanvas(canvas2D);
    canvas2D.width = width;
    canvas2D.height = height;

    // canvas2D.style.width = `${256 * aspectRatio}px`;
    // canvas2D.style.height = `${256}px`;
    // canvas2D.style.position = "fixed";
    // canvas2D.style.top = "0";
    // canvas2D.style.left = "0";
    // canvas2D.style.zIndex = "1000";

    document.body.append(canvas2D);
    textureCanvas.current = new THREE.CanvasTexture(canvas2D);
    textureCanvas.current.minFilter = THREE.LinearFilter;
    textureCanvas.current.magFilter = THREE.LinearFilter;
    textureCanvas.current.format = THREE.RGBAFormat;

    const ctx = canvas2D.getContext("2d");
    ctx?.fillRect(0, 0, width, height);
    if (ctx) setCtxCanvas(ctx);

    // Load inage texture
    // const image = new Image();
    // image.src = "/img/glow.png";
    // image.onload = () => {
    //   imageRef.current = image;
    // };

    // pointRef.current?.geometry?.setIndex(null);
    // pointRef.current?.geometry?.deleteAttribute("normal");

    return () => {
      document.body.removeChild(canvas2D);
    };
  }, []);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}
