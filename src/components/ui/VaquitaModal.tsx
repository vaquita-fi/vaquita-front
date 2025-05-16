"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { VaquitaData } from "@/types/Vaquita";
import { useState } from "react";
import Image from "next/image";

interface VaquitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (cow: VaquitaData) => void;
  vaquitas: VaquitaData[];
}

export const VaquitaModal = ({
  isOpen,
  onClose,
  onWithdraw,
  vaquitas,
}: VaquitaModalProps) => {
  const [confirming, setConfirming] = useState<string | null>(null);

  // Excluir los vaquitas retirados
  const activeVaquitas = vaquitas.filter((cow) => cow.status !== "inactive");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      closeButton={
        <Image src="/close-circle.svg" alt="close" width={44} height={44} />
      }
      size="2xl"
    >
      <ModalContent className="p-4 bg-background">
        <ModalHeader className="mb-4 text-lg font-semibold">
          Vaquitas Overview
        </ModalHeader>

        <ModalBody>
          {activeVaquitas.length > 0 ? (
            <Table aria-label="Vaquitas Overview" className="w-full">
              <TableHeader>
                <TableColumn>Amount (USDC)</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {activeVaquitas.map((cow) => (
                  <TableRow key={cow.id}>
                    <TableCell>{cow.amount}</TableCell>
                    <TableCell>
                      {confirming === cow.id ? (
                        <div className="flex gap-2">
                          <Button
                            className="text-white bg-error"
                            onPress={() => {
                              onWithdraw(cow);
                              setConfirming(null);
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                            className="text-black bg-gray-300"
                            onPress={() => setConfirming(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="text-white bg-error"
                          isDisabled={cow.status !== "active"}
                          onPress={() => {
                            setConfirming(cow.id);
                          }}
                        >
                          Withdraw
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-600">No vaquitas available.</p>
          )}
        </ModalBody>

        <ModalFooter className="flex justify-end">
          <Button className="text-white bg-primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
