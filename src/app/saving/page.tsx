"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useGoals } from "@/hooks/goals/useGoals";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import SavingDashboard from "@/components/ui/SavingDashboard";

export default function Page() {
  const { user } = usePrivy();
  const address = user?.wallet?.address;
  const { data: goals = [], isLoading, isError } = useGoals(address || "");
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (address) {
      onOpen();
    }
  }, [address, onOpen]);

  const handleSelectGoal = (goalId: string) => {
    router.push(`/saving/${goalId}`);
    onOpenChange();
  };

  const handleCreateGoal = () => {
    router.push("/saving/new"); // ✅ mejor ruta semántica
    onOpenChange();
  };

  if (!address) {
    return <div>Conecte su wallet para ver sus mundos.</div>;
  }

  if (isLoading) {
    return <div>Cargando mundos...</div>;
  }

  if (isError) {
    return <div>Error cargando mundos.</div>;
  }

  return (
    <>
      <SavingDashboard goalId={"db0299f7-566c-449b-883d-84e45eb31834"} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-2xl font-bold text-center">
                Selecciona o crea un Mundo
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-4 py-4 overflow-x-auto">
                  {/* Card para crear nuevo objetivo */}
                  <div
                    onClick={handleCreateGoal}
                    className="min-w-[250px] p-4 border-2 border-dashed rounded-lg bg-white hover:bg-gray-100 cursor-pointer flex-shrink-0 text-center"
                  >
                    <h3 className="mb-2 text-lg font-bold text-primary">
                      + Crear nuevo
                    </h3>
                    <p className="text-sm">
                      Empieza un nuevo objetivo de ahorro
                    </p>
                  </div>

                  {/* Cards de mundos existentes */}
                  {goals.length > 0 ? (
                    goals.map((goal) => (
                      <div
                        key={goal.goalId}
                        onClick={() => handleSelectGoal(goal.goalId)}
                        className="min-w-[250px] p-4 border rounded-lg bg-white hover:bg-gray-100 cursor-pointer flex-shrink-0 text-center"
                      >
                        <h3 className="text-lg font-semibold">{goal.name}</h3>
                        <p className="mt-2 text-sm">
                          Meta: {goal.targetAmount} USDC
                        </p>
                        <p className="text-sm">
                          Ahorrado: {goal.depositedAmount} USDC
                        </p>
                        <p className="text-sm">
                          Progreso: {goal.progressPercent}%
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="w-full text-center">
                      No tienes mundos todavía.
                    </p>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
