import Image from "next/image";

const SocialLinks = () => {
  return (
    <div>
      <p className="text-sm font-semibold">Follow us</p>
      <div className="flex flex-col gap-2 py-4">
        <a
          href="https://x.com/VaquitaProtocol"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="flex flex-col items-center justify-center w-full px-1 py-2 transition border border-b-4 border-black rounded-md hover:bg-primary">
            <Image
              src="/icons/BsTwitterX.svg"
              alt="Twitter"
              width={20}
              height={20}
            />
            <p>Twitter</p>
          </button>
        </a>

        <a
          href="https://t.me/vaquitaprotocol"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="flex flex-col items-center justify-center w-full px-1 py-2 transition border border-b-4 border-black rounded-md hover:bg-primary">
            <Image
              src="/icons/BiLogoTelegram.svg"
              alt="Telegram"
              width={24}
              height={24}
            />
            <p>Telegram</p>
          </button>
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
