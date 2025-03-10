import { useWindowSize } from "@/utils/useScree";
import { useTexture } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import { fragmentShader, vertexShader } from "./shader";
import { useFBOManager } from "./useFBOManager";
import * as THREE from "three";

const CarouselItem = ({
  index,
  data,
  uniforms,
  itemWidth,
  itemRefs,
  fboManager,
  isActive,
  setActiveItem,
  ...rest
}: {
  index: number;
  data: Film;
  uniforms: Record<string, THREE.Uniform>;
  itemWidth: number;
  itemRefs: any;
  fboManager: ReturnType<typeof useFBOManager>;
  isActive: boolean;
  setActiveItem: (index: number, active: boolean) => void;
} & THREE.MeshProps) => {
  // const scale = useAspect(texture.image.width, texture.image.height, 1);
  const { width, height } = useWindowSize();
  const texture = useTexture(data.movie_banner);

  const renderTarget = useRef<THREE.WebGLRenderTarget | null>(null);

  const max = 50;
  const mouse = useRef(new THREE.Vector2());
  const prevMouse = useRef(new THREE.Vector2());
  const currentWave = useRef(0);
  const meshes = useRef<THREE.Mesh[]>([]);
  const textureBrush = useTexture("/img/brush.png");
  const fboScene = useRef(new THREE.Scene());

  // Using for tracking when the last mesh is invisible
  const visibleMeshCount = useRef(0);

  const isClicked = useRef(false);
  const idTimeout = useRef(null);

  const isHovering = useRef(false);

  const uniform = useMemo(() => {
    return {
      ...uniforms,
      uTexture: new THREE.Uniform(texture),
      uTextureAspect: new THREE.Uniform(
        texture.image.width / texture.image.height
      ),
      uDisplacement: new THREE.Uniform(null),
    };
  }, [texture]);

  useEffect(() => {
    for (let i = 0; i < max; i++) {
      const m = new THREE.MeshBasicMaterial({
        map: textureBrush,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 1, 1), m);
      mesh.rotation.z = Math.random() * Math.PI * 2;
      mesh.visible = false;
      fboScene.current.add(mesh);
      meshes.current.push(mesh);
    }
  }, []);

  const setNewWave = (x, y, index) => {
    const mesh = meshes.current[index];
    if (!mesh.visible) visibleMeshCount.current++;
    mesh.visible = true;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.scale.x = mesh.scale.y = 2;
    mesh.material.opacity = 0.5;
  };
  const trackMousePos = () => {
    if (
      Math.abs(mouse.current.x - prevMouse.current.x) < 5 &&
      Math.abs(mouse.current.y - prevMouse.current.y) < 5
    ) {
      // currentMouse.current = mouse.current.x;
    } else {
      currentWave.current = (currentWave.current + 1) % max;
      setNewWave(mouse.current.x, mouse.current.y, currentWave.current);
    }
    prevMouse.current.x = mouse.current.x;
    prevMouse.current.y = mouse.current.y;

    // Handle mesh fade out
    meshes.current.forEach((mesh, idx) => {
      if (mesh.visible) {
        mesh.rotation.z += 0.02;
        mesh.material.opacity *= 0.98;
        mesh.scale.x = (isClicked.current ? 1.05 : 0.999) * mesh.scale.x + 0.25;
        mesh.scale.y = mesh.scale.x;
        if (mesh.material.opacity < 0.002) {
          mesh.visible = false;
          visibleMeshCount.current--;

          if (visibleMeshCount.current === 0) {
            setActiveItem(index, false);
          }
        }
      }
    });
  };

  const update = (state) => {
    if (isActive) {
      if (!renderTarget.current) {
        renderTarget.current = fboManager.requestFBO(index);
      }
      if (!fboManager.hasFBO(index)) {
        renderTarget.current = null;
        uniform.uDisplacement.value = null;
        setActiveItem(index, false);
        meshes.current.forEach((mesh) => {
          mesh.visible = false;
        });
      }

      // If we have an FBO, render to it
      if (renderTarget.current) {
        const { gl, camera } = state;
        gl.setRenderTarget(renderTarget.current);
        gl.clear();
        gl.render(fboScene.current, camera);
        uniform.uDisplacement.value = renderTarget.current.texture;
        gl.setRenderTarget(null);

        trackMousePos();
      }
    }
  };

  useEffect(() => {
    itemRefs[index] = update;
  }, [isActive]);

  return (
    <mesh
      onPointerEnter={() => {
        isHovering.current = true;
        setActiveItem(index, true);
      }}
      onPointerMove={(e) => {
        const x = e.uv.x - 0.5;
        const y = e.uv.y - 0.5;
        mouse.current.x = x * width;
        mouse.current.y = y * height;
      }}
      onPointerLeave={() => {
        isHovering.current = false;
      }}
      onClick={() => {
        if (idTimeout.current) clearTimeout(idTimeout.current);
        isClicked.current = true;
        idTimeout.current = setTimeout(() => {
          isClicked.current = false;
        }, 2000);
      }}
      {...rest}
    >
      <planeGeometry args={[itemWidth, itemWidth * 1.5, 15, 15]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniform}
      />
    </mesh>
  );
};

export default CarouselItem;
