"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

const Item = ({ data, ...rest }: { data: Film } & THREE.MeshProps) => {
  return (
    <mesh {...rest}>
      <planeGeometry args={[2, 3, 15, 15]} />
      <meshBasicMaterial color="red" wireframe />
    </mesh>
  );
};

const CarouselSlide = () => {
  const { data } = useQuery({
    queryKey: ["films"],
    queryFn: async () =>
      axios("https://ghibliapi.vercel.app/films", {
        method: "GET",
      }).then((res) => {
        return res.data as Film[];
      }),
  });

  return (
    <Canvas style={{ width: "100%", height: "100vh" }}>
      <group>
        {data?.slice(0, 5).map((i, idx) => (
          <Item key={i.id} data={i} position-x={idx * 2.1} />
        ))}
      </group>
    </Canvas>
  );
};

export default CarouselSlide;
