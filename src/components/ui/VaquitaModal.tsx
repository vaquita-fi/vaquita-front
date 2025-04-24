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
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Vaquita Details
            </ModalHeader>
            <ModalBody>
              {confirming ? (
                <p className="text-sm text-gray-700">
                  Are you sure you want to withdraw this cow? This action cannot
                  be undone.
                </p>
              ) : (
                <>
                  <p>
                    <strong>ID:</strong> {cow.id}
                  </p>
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
              <Button variant="light" onPress={close}>
                Close
              </Button>
              {!confirming ? (
                <Button color="danger" onPress={() => setConfirming(true)}>
                  Withdraw
                </Button>
              ) : (
                <Button
                  color="danger"
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
