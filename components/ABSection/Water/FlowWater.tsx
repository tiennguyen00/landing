/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useMemo } from "react";
import { flowWaterFragmentShader, flowWaterVertexShader } from "./shader";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FlowWater = () => {
  const number = 10000;
  const { positions, randoms, sizes } = useMemo(() => {
    const positions = new Float32Array(number * 3),
      randoms = new Float32Array(number * 3),
      sizes = new Float32Array(number);

    for (let i = 0; i < number * 3; i += 3) {
      positions[i] = Math.random() - 0.5;
      positions[i + 1] = Math.random() - 0.5;
      positions[i + 2] = Math.random() - 0.5;

      randoms[i] = Math.random();
      randoms[i + 1] = Math.random();
      randoms[i + 2] = Math.random();

      sizes[i] = 0.5 + 0.5 * Math.random();
    }

    return { positions, randoms, sizes };
  }, []);

  const uniforms = useMemo(() => {
    return {
      uTime: new THREE.Uniform(0),
    };
  }, []);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={number}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={number}
          array={randoms}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={number}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={flowWaterVertexShader}
        fragmentShader={flowWaterFragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
};

export default FlowWater;
