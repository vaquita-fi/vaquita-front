import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8 bg-gray-100">
      <h1 className="mb-8 text-2xl font-bold">Select Your Mode</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link href="/normal">
          <div className="flex items-center justify-center p-6 text-white transition bg-blue-500 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600">
            Normal Mode
          </div>
        </Link>

        <Link href="/competitive">
          <div className="flex items-center justify-center p-6 text-white transition bg-orange-500 rounded-lg shadow-lg cursor-pointer hover:bg-orange-600">
            Competitive Mode
          </div>
        </Link>

        <Link href="/collaborative">
          <div className="flex items-center justify-center p-6 text-white transition bg-green-500 rounded-lg shadow-lg cursor-pointer hover:bg-green-600">
            Collaborative Mode
          </div>
        </Link>
      </div>
    </div>
  );
}
