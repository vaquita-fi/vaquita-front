import Image from "next/image";

interface CowProps {
  size: number;
}

export default function Cow({ size }: CowProps) {
  return (
    <Image src="/cows/cow.svg" alt="Cow" width={size} height={size} priority />
  );
}
