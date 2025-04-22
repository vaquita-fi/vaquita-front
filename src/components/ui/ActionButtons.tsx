import React from "react";
import Image from "next/image";

const ActionButtons = () => {
  return (
    <div className="flex justify-around w-full py-1">
      <a
        href="https://x.com/VaquitaProtocol"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="flex items-center justify-center w-8 h-8 p-1 transition border border-b-4 border-black rounded-md hover:bg-primary">
          <Image
            src="/icons/AiTwotoneGift.svg"
            alt="Gift"
            width={30}
            height={30}
          />
        </button>
      </a>
      <a
        href="https://x.com/VaquitaProtocol"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="flex items-center justify-center w-8 h-8 p-1 transition border border-b-4 border-black rounded-md hover:bg-primary">
          <Image
            src="/icons/BsTwitterX.svg"
            alt="Twitter"
            width={24}
            height={24}
          />
        </button>
      </a>

      <a
        href="https://t.me/vaquitaprotocol"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="flex items-center justify-center w-8 h-8 p-1 transition border border-b-4 border-black rounded-md hover:bg-primary">
          <Image
            src="/icons/BiLogoTelegram.svg"
            alt="Telegram"
            width={24}
            height={24}
          />
        </button>
      </a>
    </div>
  );
};

export default ActionButtons;
