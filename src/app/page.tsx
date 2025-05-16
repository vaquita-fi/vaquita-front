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

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Header from "@/components/ui/Header/Header";
// import StatsPanel from "@/components/ui/StatsPanel";
// import TopBar from "@/components/ui/TopBar";
// import LoginButton from "@/components/ui/LoginButton";
// import { usePrivy } from "@privy-io/react-auth";
// import { Map } from "@/components/scene/Map";

// export default function Home() {
//   const { ready, login, user } = usePrivy();
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       router.push("/saving");
//     }
//   }, [user, router]);

//   return (
//     <main className="flex flex-col items-center h-dvh overflow-hidden bg-gradient-to-r from-[#CEEDFB] to-[#E8DFFC]">
//       <div className="flex flex-col justify-between w-full h-full max-w-3xl border-2 border-black bg-background">
//         <div className="relative bottom-0 left-0">
//           <Header />
//           <TopBar descriptionGoal={""} onOpenGoalModal={() => {}} />
//         </div>
//         <StatsPanel
//           totalSaved={0}
//           totalCows={0}
//           totalRemaining={0}
//           targetAmount={0}
//         />
//         <Map
//           totalSaved={0}
//           goalTarget={0}
//           goalType={"empty"}
//           cows={[]}
//           onWithdraw={() => {}}
//         />
//         <div className="relative bottom-0 left-0">
//           <LoginButton ready={ready} login={login} />
//         </div>
//       </div>
//     </main>
//   );
// }
