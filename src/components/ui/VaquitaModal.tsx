"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { VaquitaData } from "@/types/Vaquita";
import { useState } from "react";
import Image from "next/image";

interface VaquitaModalProps {
  cow: VaquitaData | null;
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (cow: VaquitaData) => void;
}

export const VaquitaModal = ({
  cow,
  isOpen,
  onClose,
  onWithdraw,
}: VaquitaModalProps) => {
  const [confirming, setConfirming] = useState(false);

  if (!cow) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      closeButton={
        <Image src="/close-circle.svg" alt="close" width={44} height={44} />
      }
    >
      <ModalContent className="bg-background">
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1 ">
              Vaquita Details
            </ModalHeader>
            <ModalBody className="py-4">
              {confirming ? (
                <p className="text-sm text-center text-gray-700">
                  Are you sure you want to withdraw this cow? This action cannot
                  be undone.
                </p>
              ) : (
                <>
                  {/* <p>
                    <strong>ID:</strong> {cow.id}
                  </p> */}
                  <p>
                    <strong>Amount:</strong> {cow.amount} USDC
                  </p>
                  <p>
                    <strong>Status:</strong> {cow.status}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {cow.createdAt.toLocaleDateString()}
                  </p>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {!confirming ? (
                <Button
                  onPress={() => setConfirming(true)}
                  className="text-white bg-error"
                >
                  Withdraw
                </Button>
              ) : (
                <Button
                  className="text-white bg-error"
                  onPress={() => {
                    onWithdraw(cow);
                    setConfirming(false);
                    close();
                  }}
                >
                  Confirm Withdraw
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
