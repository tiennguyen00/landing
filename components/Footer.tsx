import { Send } from "lucide-react";
import Image from "next/image";

const information = [
  "About us",
  "Legal informations",
  "Our terms of use",
  "Terms of Sales",
  "Delivery",
];
const account = [
  "Personal info",
  "Addresses",
  "Orders",
  "Vouchers",
  "Wishlist",
  "Alerts",
];

const maison = [
  "Official manufacturer and distributor for Studio Ghibli in Europe",
  "37 ter rue Gustave Simonet, 94200 Ivry-Sur-Seine",
  "+33146706605",
  "Contact us",
];
const Footer = () => {
  return (
    <footer className="padding !px-0 min-h-screen w-screen bg-[url('/img/footer-bg.webp')] bg-cover bg-center flex flex-col justify-center items-center space-y-24 sm:space-y-16">
      <div className="flex flex-col items-center sm:flex-row justify-around max-w-[1400px] mx-auto w-full">
        <div className="flex w-3/5 sm:w-auto">
          <img
            src="https://www.maison-ghibli.com/modules/blockreassurance/views/img/img_perso/reassurance-1.png"
            alt=""
          />
          <div className="flex justify-center flex-col font-notosans">
            <p className="font-bold">Fast delivery</p>
            <p>Shipping within 48 hours</p>
          </div>
        </div>
        <div className="flex w-3/5 sm:w-auto">
          <img
            src="https://www.maison-ghibli.com/modules/blockreassurance/views/img/img_perso/reassurance-2.png"
            alt=""
          />
          <div className="flex justify-center flex-col font-notosans">
            <p className="font-bold">Official Ghibli license.</p>
            <p>Manufacturing and importation</p>
          </div>
        </div>
        <div className="flex w-3/5 sm:w-auto">
          <img
            src="https://www.maison-ghibli.com/modules/blockreassurance/views/img/img_perso/reassurance-3.png"
            alt=""
          />
          <div className="flex justify-center flex-col font-notosans">
            <p className="font-bold">2 year warranty</p>
            <p>Pour tous nos produits</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row  items-center sm:space-y-0 sm:space-x-48 justify-center max-w-[1400px] h-[240px] mx-auto w-full ">
        <div className="w-[313px] mb-10 sm:mb-0">
          <Image
            src="https://www.maison-ghibli.com/themes/ghibli/assets/img/logos/logo-maison-ghibli-small.png"
            alt=""
            width={100}
            height={100}
            layout="responsive"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center font-notosans w-[313px]">
          <div className="flex items-center gap-2 mb-1">
            <img src="/img/letter.png" width={55} height={55} alt="" />
            <p className="text-[20px] font-semibold text-[#58585C] ">
              NEWSLETTER
            </p>
          </div>
          <div className="flex relative w-full border-[3px] border-[#845b4f] pr-10 py-2 pl-2 rounded-md bg-[#cf9e2a] mb-3">
            <input
              className="bg-transparent w-full outline-none placeholder:text-[#58585C]"
              placeholder="Your email address"
            />
            <button className="absolute right-0 top-0 w-10 h-full ">
              <Send className="text-white m-auto transform transition-transform duration-300" />
            </button>
          </div>
          <p className="text-sm">
            You may unsubscribe at any moment. For that purpose, please find our
            contact info in the legal notice.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap sm:justify-around font-notosans max-w-[1200px] w-full px-4 pb-6 mx-auto">
        <div className="flex flex-col min-w-[200px] sm:min-w-auto flex-1">
          <div className="flex items-center gap-2 mb-1">
            <img src="/img/info.png" alt="" />
            <p className="font-bold uppercase">Informations</p>
          </div>
          <ul className="font-bold">
            {information.map((i) => (
              <li
                key={i}
                className="hover:text-gray-600 cursor-pointer hover:underline mb-1"
              >
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col min-w-[200px] sm:min-w-auto  flex-1">
          <div className="flex items-center gap-2 mb-1">
            <img src="/img/h1.png" alt="" />
            <p className="font-bold uppercase">Your account</p>
          </div>
          <ul className="font-bold">
            {account.map((i) => (
              <li
                key={i}
                className="hover:text-gray-600 cursor-pointer hover:underline mb-1"
              >
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col min-w-[200px] sm:min-w-auto flex-1">
          <div className="flex items-center gap-2 mb-1">
            <img src="/img/h2.png" alt="" />
            <p className="font-bold uppercase">Maison ghibli</p>
          </div>
          <ul className="font-bold">
            {maison.map((i) => (
              <li
                key={i}
                className="hover:text-gray-600 cursor-pointer hover:underline mb-1"
              >
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full bg-black  text-white font-notosans py-1 text-center font-bold">
        © Semic Distribution - Maison Ghibli is a registered trademark -
        realised by WebXY
      </div>
    </footer>
  );
};

export default Footer;
