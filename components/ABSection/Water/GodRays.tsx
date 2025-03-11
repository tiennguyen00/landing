"use client";

import { useMemo } from "react";
import { godRaysVertexShader, godRaysFragmentShader } from "./shader";
const GodRays = () => {
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
      uTime: { value: 0 },
    };
  }, []);

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
        vertexShader={godRaysVertexShader}
        fragmentShader={godRaysFragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
};

export default GodRays;
