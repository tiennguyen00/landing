import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";

const EarlyAccessModal = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-1 flex justify-center items-center min-h-[300px]">
        <DialogTitle></DialogTitle>
        <div className="relative flex flex-col gap-2 w-full justify-center items-center">
          <p className="text-black -translate-y-1/2 leading-tight text-xl font-bold absolute top-0  text-center dark:text-white">
            We are working on this feature. <br /> Stay turned!
          </p>
          <Image
            src="/img/t-sleeping.gif"
            alt="early-access"
            width={200}
            height={200}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EarlyAccessModal;
