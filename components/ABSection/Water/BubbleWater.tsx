/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const BubbleWater = () => {
  // Increase bubble count for more natural density
  const bubbleCount = 250;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Create the bubble data with more varied sizes and natural distribution
  const { positions, scales, speeds, randomOffsets, opacities } =
    useMemo(() => {
      // Create clusters of bubbles
      const createCluster = (centerX, centerY, centerZ, count, radius) => {
        const clusterBubbles = [];
        for (let i = 0; i < count; i++) {
          // Random position within cluster radius
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * radius;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + (Math.random() - 0.5) * radius;
          const z = centerZ + Math.sin(angle) * distance;
          clusterBubbles.push(new THREE.Vector3(x, y, z - 20));
        }
        return clusterBubbles;
      };

      // Create several clusters across the scene
      const positions = [];
      const clusterCount = 6;

      for (let i = 0; i < clusterCount; i++) {
        const centerX = (Math.random() - 0.5) * 10;
        const centerY = (Math.random() - 0.5) * 10;
        const centerZ = (Math.random() - 0.5) * 5;

        // Create a cluster with random size
        const clusterBubbles = createCluster(
          centerX,
          centerY,
          centerZ,
          Math.floor(15 + Math.random() * 35), // 15-50 bubbles per cluster
          2 + Math.random() * 3 // 2-5 unit radius
        );

        positions.push(...clusterBubbles);
      }

      // Add random individual bubbles to fill the space
      const remainingBubbles = bubbleCount - positions.length;
      for (let i = 0; i < remainingBubbles; i++) {
        positions.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 6
          )
        );
      }

      // Create bimodal distribution of bubble sizes (many small, some large)
      const scales = positions.map(() => {
        // 80% small bubbles, 20% larger bubbles
        if (Math.random() < 0.8) {
          // Small bubbles (0.03 - 0.08)
          return 0.03 + Math.random() * 0.05;
        } else {
          // Larger bubbles (0.1 - 0.25)
          return 0.1 + Math.random() * 0.15;
        }
      });

      // Vary speeds based on size (smaller bubbles move faster)
      const speeds = scales.map((scale) => {
        // Inverse relationship - smaller bubbles rise faster
        const baseSpeed = 0.01 + Math.random() * 0.001;
        return baseSpeed * (0.15 / Math.max(scale, 0.05));
      });

      const randomOffsets = positions.map(() => Math.random() * Math.PI * 2);

      // Add varying opacity for each bubble
      const opacities = positions.map(() => 0.3 + Math.random() * 0.4);

      return { positions, scales, speeds, randomOffsets, opacities };
    }, []);

  // Initialize instance matrices
  useEffect(() => {
    if (meshRef.current) {
      // Set initial positions and scales for each instance
      for (let i = 0; i < bubbleCount; i++) {
        if (i < positions.length) {
          dummy.position.copy(positions[i]);
          dummy.scale.set(scales[i], scales[i], scales[i]);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  // Animation loop for bubbles
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!meshRef.current) return;

    // Animate each bubble
    for (let i = 0; i < positions.length; i++) {
      // Get current position from the instance matrix
      dummy.position.copy(positions[i]);

      // Move upward with more natural side-to-side motion
      dummy.position.y += speeds[i];

      // More complex side-to-side motion (figure-eight pattern)
      const wobbleX =
        Math.sin(time * 0.5 + randomOffsets[i]) * 0.02 * scales[i] * 5;
      const wobbleZ =
        Math.sin(time * 0.3 + randomOffsets[i] * 2) * 0.01 * scales[i] * 5;
      dummy.position.x += wobbleX;
      dummy.position.z += wobbleZ;

      // Add slight wobble to larger bubbles
      if (scales[i] > 0.1) {
        const wobbleY = Math.sin(time * 1.5 + randomOffsets[i] * 3) * 0.005;
        dummy.position.y += wobbleY;
      }

      // Reset bubble position when it reaches the top
      if (dummy.position.y > 6) {
        dummy.position.y = -6;
        // When respawning, try to keep bubbles in their original clusters
        // but with small random variations
        dummy.position.x = positions[i].x + (Math.random() - 0.5) * 1.5;
        dummy.position.z = positions[i].z + (Math.random() - 0.5) * 1.5;
        positions[i].copy(dummy.position);
      } else {
        positions[i].copy(dummy.position);
      }

      // Subtle scale pulsing for natural movement (more pronounced for larger bubbles)
      const pulseIntensity = scales[i] > 0.1 ? 0.08 : 0.04;
      const scalePulse =
        0.98 +
        Math.sin(time * (1 + scales[i] * 5) + randomOffsets[i]) *
          pulseIntensity;
      const currentScale = scales[i] * scalePulse;
      dummy.scale.set(currentScale, currentScale, currentScale);

      // Subtle rotation (especially for larger bubbles)
      dummy.rotation.x = time * 0.1 * scales[i] * 2 + randomOffsets[i];
      dummy.rotation.y = time * 0.2 * scales[i] * 2 + randomOffsets[i] * 0.5;

      // Update the instance matrix
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    // Mark the instance matrix as needing an update
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const bubleTexture = useTexture("/img/water-bubble.png");

  return (
    <>
      {/* Main instance for darker bubbles */}
      <instancedMesh
        ref={meshRef}
        args={[null, null, bubbleCount]}
        material={
          new THREE.MeshStandardMaterial({
            // color: new THREE.Color("#0F0"),
            transparent: true,
            map: bubleTexture,
          })
        }
      >
        <sphereGeometry args={[1, 16, 16]} />
      </instancedMesh>
    </>
  );
};

export default BubbleWater;
