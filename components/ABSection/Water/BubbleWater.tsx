/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Create a simple bubble texture programmatically
const createBubbleTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Clear with transparent background
  ctx.clearRect(0, 0, size, size);

  // Create a radial gradient for the bubble
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );

  // Add color stops with transparency
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.0)");
  gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
  gradient.addColorStop(0.7, "rgba(200, 230, 255, 0.3)");
  gradient.addColorStop(0.9, "rgba(200, 230, 255, 0.6)");
  gradient.addColorStop(1.0, "rgba(180, 210, 240, 0.0)");

  // Fill circle with gradient
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Add highlight
  ctx.beginPath();
  ctx.arc(size / 2 - size / 5, size / 2 - size / 5, size / 10, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fill();

  // Create a Three.js texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  return texture;
};

const BubbleWater = () => {
  const sprites = useRef([]);
  const { viewport } = useThree();

  // Create programmatic bubble texture instead of loading from file
  const bubbleTexture = useMemo(() => createBubbleTexture(), []);

  // Create the sprite material
  const material = useMemo(() => {
    return new THREE.SpriteMaterial({
      map: bubbleTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [bubbleTexture]);

  // Initialize sprites
  useMemo(() => {
    // Clear existing sprites
    sprites.current = [];

    // Create clusters of bubbles
    const createCluster = (centerX, centerY, centerZ, count, radius) => {
      for (let i = 0; i < count; i++) {
        // Random position within cluster radius
        const angle = Math.random() * Math.PI * 2;
        const distance = 10;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + (Math.random() - 0.5) * radius;
        const z = centerZ + Math.sin(angle) * distance;

        const sprite = new THREE.Sprite(material.clone());
        sprite.position.set(
          x,
          Math.random() * viewport.height - viewport.height / 2,
          z
        );

        // Bimodal distribution of bubble sizes
        let scale;
        if (Math.random() < 0.8) {
          // Small bubbles (0.03 - 0.08)
          scale = 0.1 + Math.random() * 0.1;
        } else {
          // Larger bubbles (0.1 - 0.25)
          scale = 0.2 + Math.random() * 0.3;
        }

        sprite.scale.set(scale, scale, 1);

        // Store velocity and random offsets
        sprite.userData.velocity = Math.random() * 0.005;
        sprite.userData.wobble = 0.05 * Math.random() * Math.PI * 2;

        sprites.current.push(sprite);
      }
    };

    // Create several clusters across the scene
    const clusterCount = 6;
    for (let i = 0; i < clusterCount; i++) {
      const centerX = 0;
      const centerY = 0;
      const centerZ = 0;

      createCluster(
        centerX,
        centerY,
        centerZ,
        Math.floor(5 + Math.random() * 5), // 10-20 bubbles per cluster
        2 + Math.random() * 3 // 2-5 unit radius
      );
    }

    return sprites.current;
  }, [material]);

  // Animation loop for bubbles
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    sprites.current.forEach((sprite) => {
      // Move upward
      sprite.position.y += sprite.userData.velocity;

      // Complex side-to-side motion
      const wobbleX = Math.sin(time * 1.5 + sprite.userData.wobble) * 0.002;
      const wobbleZ = Math.sin(time * 1.3 + sprite.userData.wobble * 2) * 0.001;
      sprite.position.x += wobbleX;
      sprite.position.z += wobbleZ;

      // Reset bubble position when it reaches the top
      if (sprite.position.y > 6) {
        sprite.position.y = -6;
        sprite.position.x = sprite.position.x + (Math.random() - 0.5) * 3.5;
        sprite.position.z = sprite.position.z + (Math.random() - 0.5) * 3.5;
      }

      // Subtle scale pulsing for natural movement
      const scalePulse = 0.98 + Math.sin(time + sprite.userData.wobble) * 0.05;
      const currentScale = sprite.scale.x * scalePulse;
      // sprite.scale.set(currentScale, currentScale, 1);
    });
  });

  return (
    <group>
      {sprites.current.map((sprite, i) => (
        <primitive key={i} object={sprite} />
      ))}
    </group>
  );
};

export default BubbleWater;
