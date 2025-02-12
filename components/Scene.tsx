"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  renderFragmentShader,
  renderVertexShader,
  simulationFragmentShader,
  simulationVertexShader,
} from "./shaders";

export default function Scene() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctxCanvas, setCtxCanvas] = useState<CanvasRenderingContext2D>();
  const textureCanvas = useRef<THREE.CanvasTexture>(null);
  // Create canvas2D
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
    const fontSize = Math.round(250 * window.devicePixelRatio);
    const ctx = canvas.getContext("2d");

    ctx!.fillStyle = "#fb7427";
    ctx?.fillRect(0, 0, width, height);

    ctx!.fillStyle = "#fef4b8";
    ctx!.font = `bold ${fontSize}px Test Söhne`;
    ctx!.textAlign = "center";
    ctx!.textBaseline = "middle";
    ctx!.textRendering = "geometricPrecision";
    ctx!.imageSmoothingEnabled = true;
    ctx!.imageSmoothingQuality = "high";
    ctx!.fillText("STUDIO GHIBLI", 100, 100);

    const image = new Image();
    image.src = "/img/banner.webp";
    // ctx.drawImage(
    //   image,
    //   canvasCursor.x - growSize * 0.5,
    //   canvasCursor.y - growSize * 0.5,
    //   growSize,
    //   growSize,
    // )

    const textureTexture = new THREE.CanvasTexture(canvas);
    textureTexture.minFilter = THREE.LinearFilter;
    textureTexture.magFilter = THREE.LinearFilter;
    textureTexture.format = THREE.RGBAFormat;

    renderer.domElement.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX * window.devicePixelRatio;
      mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
    });

    renderer.domElement.addEventListener("mouseleave", () => {
      mouse.set(0, 0);
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

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

  return <></>;
}
