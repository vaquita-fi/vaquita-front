"use client";

import { useState } from "react";
import { useGoalsManager } from "@/hooks/useGoalsManager";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

const walletAddress = "0x1234abcd5678ef90"; // Simulación

export default function TestVaquitaApp() {
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState(0);
  const [newGoalDuration, setNewGoalDuration] = useState(90);

  const {
    goals,
    goalsLoading,
    rewardsUnlocked,
    rewardModalOpen,
    setRewardModalOpen,
    fetchGoals,
    createGoal,
    deposit,
    withdrawAll,
    withdrawDeposit,
    deleteGoal,
    updateProgress,
  } = useGoalsManager(walletAddress);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Crear nuevo objetivo */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Nombre del objetivo"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Monto objetivo"
            value={newGoalAmount}
            onChange={(e) => setNewGoalAmount(Number(e.target.value))}
            className="p-2 border rounded"
          />
          <select
            value={newGoalDuration}
            onChange={(e) => setNewGoalDuration(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={90}>3 meses (90 días)</option>
            <option value={180}>6 meses (180 días)</option>
            <option value={365}>1 año (365 días)</option>
          </select>
          <button
            onClick={() =>
              createGoal({
                name: newGoalName,
                amount: newGoalAmount,
                duration: newGoalDuration,
              })
            }
            className="p-3 text-white bg-blue-600 rounded"
          >
            Crear Objetivo
          </button>
        </div>
        <button
          onClick={() => fetchGoals()}
          className="p-3 text-white bg-green-600 rounded"
        >
          Ver Objetivos
        </button>
      </div>

      {/* Mostrar objetivos */}
      {goalsLoading ? (
        <p className="text-center">Cargando objetivos...</p>
      ) : goals.length > 0 ? (
        <div className="space-y-8">
          {goals.map((goal) => (
            <div key={goal.goalId} className="p-6 bg-white rounded shadow">
              <div className="flex items-center justify-between">
                <h3 className="mb-2 text-lg font-bold">{goal.name}</h3>
                <button
                  onClick={() => deleteGoal(goal.goalId)}
                  className="p-2 text-white bg-red-500 rounded"
                >
                  Cancelar
                </button>
              </div>
              <p>
                <strong>Meta:</strong> {goal.targetAmount} USDC
              </p>
              <p>
                <strong>Duración:</strong> {goal.durationDays} días
              </p>
              <p>
                <strong>Ahorrado:</strong> {goal.depositedAmount} USDC
              </p>
              <p>
                <strong>Progreso:</strong> {goal.progressPercent}%
              </p>
              <p>
                <strong>Intereses:</strong> {goal.interestsAccumulated} USDC
              </p>
              <p>
                <strong>Estado:</strong> {goal.status}
              </p>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => deposit({ goalId: goal.goalId, amount: 10 })}
                  className="p-2 text-white bg-purple-500 rounded"
                >
                  Depositar 10 USDC
                </button>
                <button
                  onClick={() => withdrawAll(goal.goalId)}
                  className="p-2 text-white bg-red-500 rounded"
                >
                  Retirar Todo
                </button>
                <button
                  onClick={() => updateProgress(goal.goalId)}
                  className="p-2 text-white bg-yellow-500 rounded"
                >
                  Actualizar Progreso
                </button>
              </div>

              {/* Depósitos */}
              <div className="mt-6">
                <h4 className="mb-2 font-bold">Depósitos:</h4>
                {goal.deposits?.length > 0 ? (
                  <div className="space-y-2">
                    {goal.deposits.map((deposit) => (
                      <div
                        key={deposit.depositId}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded"
                      >
                        <span>
                          {deposit.amount} USDC -{" "}
                          {deposit.withdrawn ? "Retirado" : "Activo"}
                        </span>
                        {!deposit.withdrawn && (
                          <button
                            onClick={() =>
                              withdrawDeposit({
                                goalId: goal.goalId,
                                depositId: deposit.depositId,
                              })
                            }
                            className="p-1 text-xs text-white bg-red-600 rounded"
                          >
                            Retirar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay depósitos todavía.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No tienes objetivos aún.</p>
      )}

      {/* Modal de rewards */}
      <Modal isOpen={rewardModalOpen} onOpenChange={setRewardModalOpen}>
        <ModalContent>
          <ModalHeader>🎉 ¡Premio desbloqueado!</ModalHeader>
          <ModalBody>
            {rewardsUnlocked.map((reward) => (
              <div key={reward.milestone} className="p-2">
                <p className="text-lg">
                  🎯 Alcanzaste el {reward.milestone}%: Ganaste{" "}
                  <strong>{reward.rewardAmount.toFixed(2)} USDC</strong> de
                  interés.
                </p>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => setRewardModalOpen(false)}>
              ¡Genial!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
