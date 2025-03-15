import { Suspense } from "react";
import BubbleWater from "../Water/BubbleWater";
import GodRays from "../Water/GodRays";
import Light from "./Light";

const Enviroment = () => {
  return (
    <>
      {/* <Light /> */}
      <GodRays />
      <BubbleWater />
    </>
  );
};

export default Enviroment;
