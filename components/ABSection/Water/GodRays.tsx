/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import { useMemo } from "react";
import { godRaysFragmentShader, godRaysVertexShader } from "./shader";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
const GodRays = () => {
  const [viewport, camera] = useThree((state) => [
    state.viewport,
    state.camera,
  ]);
  console.log("viewport", viewport.getCurrentViewport(camera, [0, 0, 0]));
  const texture = useTexture("/img/noise-texture.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const uniforms = useMemo(() => {
    return {
      uTime: new THREE.Uniform(0),
      uTexture: new THREE.Uniform(texture),
    };
  }, []);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <>
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
        <shaderMaterial
          vertexShader={godRaysVertexShader}
          fragmentShader={godRaysFragmentShader}
          uniforms={uniforms}
          side={THREE.FrontSide}
          transparent={true}
        />
      </mesh>
    </>
  );
};

export default GodRays;
