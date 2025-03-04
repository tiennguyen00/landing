import { useRef, useEffect } from "react";
import * as THREE from "three";

// FBO Manager to handle dynamic allocation and release of FBOs
const useFBOManager = (width: number, height: number, maxFBOs = 2) => {
  const fboPool = useRef<THREE.WebGLRenderTarget[]>([]);
  const activeItems = useRef<Record<string, THREE.WebGLRenderTarget | null>>(
    {}
  );
  const renderer = useRef<THREE.WebGLRenderer | null>(null);

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
      activeItems.current = {};
    };
  }, [width, height, maxFBOs]);

  // Clear an FBO's contents
  const clearFBO = (fbo: THREE.WebGLRenderTarget, gl: THREE.WebGLRenderer) => {
    // Store current render target
    const currentRenderTarget = gl.getRenderTarget();
    // Set to our FBO and clear it
    gl.setRenderTarget(fbo);
    gl.clear();
    // Restore previous render target
    gl.setRenderTarget(currentRenderTarget);

    return fbo;
  };

  // Request an FBO for an item
  const requestFBO = (itemIndex: number, gl?: THREE.WebGLRenderer) => {
    // Store renderer reference if provided
    if (gl && !renderer.current) {
      renderer.current = gl;
    }

    // Check if this item already has an FBO assigned
    if (activeItems.current[itemIndex]) {
      return activeItems.current[itemIndex];
    }

    // Check if there's an available FBO in the pool
    if (fboPool.current.length > 0) {
      const fbo = fboPool.current.pop();
      activeItems.current[itemIndex] = fbo ?? null;
      return fbo;
    }

    // No FBO available - ake the FBO from the least recently used item:
    const oldestItemIndex = Object.keys(activeItems.current)[0];
    if (oldestItemIndex && oldestItemIndex !== itemIndex.toString()) {
      const fbo = activeItems.current[Number(oldestItemIndex)];
      delete activeItems.current[Number(oldestItemIndex)];
      activeItems.current[itemIndex] = fbo;
      return fbo;
    }

    return null;
  };

  // Release an FBO when no longer needed
  const releaseFBO = (itemIndex: number) => {
    const fbo = activeItems.current[itemIndex];
    if (fbo) {
      delete activeItems.current[itemIndex];
      fboPool.current.push(fbo);
    }
  };

  // Check if an item currently has an FBO
  const hasFBO = (itemIndex: number) => {
    return !!activeItems.current[itemIndex];
  };

  return { requestFBO, releaseFBO, hasFBO, activeItems: activeItems.current };
};
export { useFBOManager };
