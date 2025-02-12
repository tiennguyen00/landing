"use client";
import { useEffect } from "react";
import * as THREE from "three";
import {
  renderFragmentShader,
  renderVertexShader,
  simulationFragmentShader,
  simulationVertexShader,
} from "./shaders";

export default function Scene() {
  // const textureCanvas = useRef<THREE.CanvasTexture>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add styling to the renderer's canvas
    // renderer.domElement.style.position = "absolute";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    document.body.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2();
    let frame = 0;

    const width = window.innerWidth * window.devicePixelRatio,
      height = window.innerHeight * window.devicePixelRatio;
    const options = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    };
    let rtA = new THREE.WebGLRenderTarget(width, height, options);
    let rtB = new THREE.WebGLRenderTarget(width, height, options);

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });

    const renderMaterials = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: null },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    const renderQuad = new THREE.Mesh(plane, renderMaterials);

    simScene.add(simQuad);
    scene.add(renderQuad);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    // const fontSize = Math.round(120 * window.devicePixelRatio);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Could not get 2D context");
      return;
    }

    // Clear the canvas first
    ctx.clearRect(0, 0, width, height);

    const image = new Image();
    image.src = "/img/banner-2.webp";

    // Create a promise to handle image loading
    const loadImage = new Promise((resolve) => {
      image.onload = () => {
        // Draw image to fit canvas while maintaining aspect ratio
        const scale = Math.max(width / image.width, height / image.height);
        const x = (width - image.width * scale) / 2;
        const y = (height - image.height * scale) / 2;

        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
        resolve(null);
      };
    });

    // Create texture after image is loaded
    loadImage.then(() => {
      const textureTexture = new THREE.CanvasTexture(canvas);
      textureTexture.minFilter = THREE.LinearFilter;
      textureTexture.magFilter = THREE.LinearFilter;
      textureTexture.format = THREE.RGBAFormat;

      renderer.domElement.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX * window.devicePixelRatio;
        mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
      });

      const animate = () => {
        simMaterial.uniforms.frame.value = frame++;
        // simMaterial.uniforms.time.value = performance.now() / 1000;

        simMaterial.uniforms.textureA.value = rtA.texture;
        renderer.setRenderTarget(rtB);
        renderer.render(simScene, camera);

        renderMaterials.uniforms.textureA.value = rtB.texture;
        renderMaterials.uniforms.textureB.value = textureTexture;
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);

        const temp = rtA;
        rtA = rtB;
        rtB = temp;

        requestAnimationFrame(animate);
      };

      animate();
    });

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      // Correct cleanup - remove the renderer's DOM element
      renderer.domElement.remove();
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <></>;
}
