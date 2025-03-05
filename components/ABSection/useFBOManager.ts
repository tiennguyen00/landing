/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const useFBOManager = (width: number, height: number, maxFBOs = 3) => {
  const { gl } = useThree();
  const fboPool = useRef<THREE.WebGLRenderTarget[]>([]);
  const activeItems = useRef(new Map<number, THREE.WebGLRenderTarget | null>());

  // Initialize FBO pool
  useEffect(() => {
    for (let i = 0; i < maxFBOs; i++) {
      fboPool.current.push(
        new THREE.WebGLRenderTarget(width / 4, height / 4, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
        })
      );
    }

    return () => {
      // Clean up FBOs on unmount
      fboPool.current.forEach((fbo) => fbo.dispose());
      fboPool.current = [];
      activeItems.current.clear();
    };
  }, [width, height]);

  // Request an FBO for an item
  const requestFBO = (itemIndex: number) => {
    // Check if this item already has an FBO assigned
    if (activeItems.current.has(itemIndex)) {
      return activeItems.current.get(itemIndex);
    }

    // Check if there's an available FBO in the pool
    if (fboPool.current.length > 0) {
      const fbo = fboPool.current.pop();
      activeItems.current.set(itemIndex, fbo);
      return fbo;
    }

    // No FBO available - take the FBO from the least recently used item
    const oldestItemIndex = [...activeItems.current.keys()][0];
    if (oldestItemIndex !== undefined && oldestItemIndex !== itemIndex) {
      console.log("reassigning FBO", oldestItemIndex, itemIndex);
      const fbo = activeItems.current.get(oldestItemIndex);

      // Update references
      activeItems.current.delete(oldestItemIndex);
      activeItems.current.set(itemIndex, fbo);

      return fbo;
    }

    return null;
  };

  // Release an FBO when no longer needed
  const releaseFBO = (itemIndex: number) => {
    const fbo = activeItems.current.get(itemIndex);
    if (fbo) {
      activeItems.current.delete(itemIndex);
      fboPool.current.push(fbo);
    }
  };

  // Check if an item currently has an FBO
  const hasFBO = (itemIndex: number) => {
    return activeItems.current.has(itemIndex);
  };

  return {
    requestFBO,
    releaseFBO,
    hasFBO,
    activeItems,
  };
};

export { useFBOManager };
