import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";
import { waterVertexShader, waterFragmentShader } from "./shader";
import { useFrame } from "@react-three/fiber";

interface SurfaceWaterProps {
  itemWidth: number;
}

const SurfaceWater = ({ itemWidth }: SurfaceWaterProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const {
    elevationB,
    frequencyB,
    speedB,
    elevationS,
    frequencyS,
    speedS,
    interationS,
  } = useControls("Vertext", {
    "big-waves": folder({
      elevationB: 0.2,
      frequencyB: {
        value: {
          x: 4,
          y: 1.5,
        },
      },
      speedB: 0.75,
    }),
    "small-waves": folder({
      elevationS: {
        value: 0.15,
        step: 0.05,
      },
      frequencyS: 3,
      speedS: 0.2,
      interationS: 4.0,
    }),
  });

  const { depth, surface, offset, multiplier } = useControls("Fragment", {
    color: folder({
      depth: "#186691",
      surface: "#9bd8ff",
      offset: {
        value: 0.15,
        step: 0.05,
      },
      multiplier: 5,
    }),
  });
  const uniforms = useMemo(
    () => ({
      uBigWavesElevation: { value: 0.2 },
      uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
      uTime: { value: 0 },
      uBigWavesSpeed: { value: 0.75 },
      uDepthColor: { value: new THREE.Color(depth) },
      uSurfaceColor: { value: new THREE.Color(surface) },
      uColorOffset: { value: 0.08 },
      uColorMultiplier: { value: 5 },

      uSmallWavesElevation: { value: 0.15 },
      uSmallWavesFrequency: { value: 3 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallIterations: { value: 4 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef) return;
    const t = state.clock.getElapsedTime();
    (meshRef.current?.material as THREE.ShaderMaterial).uniforms.uTime.value =
      t;
  });

  useEffect(() => {
    uniforms.uBigWavesElevation.value = elevationB;
    uniforms.uBigWavesFrequency.value.x = frequencyB.x;
    uniforms.uBigWavesFrequency.value.y = frequencyB.y;
    uniforms.uBigWavesSpeed.value = speedB;
    uniforms.uDepthColor.value = new THREE.Color(depth);
    uniforms.uSurfaceColor.value = new THREE.Color(surface);
    uniforms.uColorOffset.value = offset;
    uniforms.uColorMultiplier.value = multiplier;

    uniforms.uSmallWavesElevation.value = elevationS;
    uniforms.uSmallWavesFrequency.value = frequencyS;
    uniforms.uSmallWavesSpeed.value = speedS;
    uniforms.uSmallIterations.value = interationS;
  }, [
    depth,
    elevationB,
    elevationS,
    frequencyB.x,
    frequencyB.y,
    frequencyS,
    interationS,
    multiplier,
    offset,
    speedB,
    speedS,
    surface,
  ]);

  return (
    <mesh
      ref={meshRef}
      // rotation-x={-Math.PI * 0.5}
      scale={itemWidth}
      position-y={1.5}
    >
      <planeGeometry
        args={[2 * itemWidth, 2 * itemWidth, 512, 512]}
        scale={itemWidth}
      />
      <shaderMaterial
        side={THREE.DoubleSide}
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default SurfaceWater;
