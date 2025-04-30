import Image from "next/image";

const LoadingScreen = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 text-center h-dvh">
    <Image src="/loading.svg" alt="Loading" width={200} height={200} />
    <p className="text-lg text-gray-600 ">{message}</p>
  </div>
);
export default LoadingScreen;
