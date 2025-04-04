// import { logError, showNotification } from "@/vaquita-ui-submodule/helpers";
// import { useVaquitaPool } from "@/web3/hooks";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Transaction } from "../../types";
import Image from "next/image";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  type: "deposit" | "withdraw";
  withdrawType?: "early" | "onTime";
}

export const TransactionModal = ({
  isOpen,
  onClose,
  transaction,
  type,
  withdrawType,
}: TransactionModalProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { deposit, withdraw } = useVaquitaPool();
  const [error, setError] = useState(false);

  //   const handleDeposit = async (amount: string) => {
  //     if (!amount || isNaN(Number(amount))) {
  //       console.error("Invalid amount. Please enter a valid number.");
  //       setError(true);
  //       return;
  //     }

  //     setIsLoading(true);
  //     try {
  //       const { error, success } = await deposit(+amount);
  //       if (!success) {
  //         logError("transaction error", error);
  //         throw new Error("transaction error");
  //       }
  //       onClose();
  //       showNotification("Payment successful!", "success");
  //     } catch (error) {
  //       logError("Payment unsuccessful. Please check and try again.", error);
  //       showNotification(
  //         "Payment unsuccessful. Please check and try again.",
  //         "error"
  //       );
  //     }
  //     setIsLoading(false);
  //   };

  //   const handleWithdraw = async (depositId: `0x${string}`) => {
  //     setIsLoading(true);
  //     try {
  //       const { error, success } = await withdraw(depositId);
  //       if (!success) {
  //         logError("transaction error", error);
  //         throw new Error("transaction error");
  //       }
  //       onClose();
  //       showNotification("Withdraw successful!", "success");
  //     } catch (error) {
  //       logError("Withdraw unsuccessful. Please check and try again.", error);
  //       showNotification(
  //         "Withdraw unsuccessful. Please check and try again.",
  //         "error"
  //       );
  //     }
  //     setIsLoading(false);
  //   };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onClose();
        setError(false);
      }}
      className="bg-gradient-to-r from-[#CDEDFB] to-[#E8DFFC]"
      closeButton={
        <Image
          src="/icons/close.svg"
          alt="Groups Active"
          width={45}
          height={45}
        />
      }
    >
      <ModalContent className="py-2">
        <ModalHeader className="flex flex-col justify-center text-center">
          {type === "deposit"
            ? "Deposit Now"
            : withdrawType === "early"
            ? "Withdraw now?"
            : "Withdraw your savings!"}
        </ModalHeader>
        <ModalBody className="text-center">
          {type === "deposit" ? (
            <>
              <Input
                // className="text-black bg-white  rounded-xl"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                endContent={<span className="text-gray-500">USDC</span>}
                classNames={{
                  mainWrapper: "bg-transparent p-0 m-0",
                  errorMessage: "flex",
                }}
                errorMessage="Please enter a valid amount"
                isInvalid={error}
              />
            </>
          ) : transaction ? (
            withdrawType === "early" ? (
              <p>
                You have <strong>{transaction.left} days</strong> left and will
                lose your interest.
              </p>
            ) : (
              <p>
                {`Goal reached! You've earned `}
                <strong>{transaction.amount} in interest.</strong>
              </p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className={`w-full text-black border border-black border-b-4 rounded-xl px-4 py-2 ${
              type === "withdraw"
                ? withdrawType === "early"
                  ? "bg-[#F3616F]"
                  : "bg-green-500"
                : "bg-[#28A745] py-4"
            }`}
            onPress={
              !isLoading
                ? type === "deposit"
                  ? () => handleDeposit(amount)
                  : () => handleWithdraw(transaction?.id as `0x${string}`)
                : undefined
            }
            disabled={isLoading}
          >
            {type === "withdraw" ? "Withdraw" : "Deposit"}
            {isLoading && (
              <FaSpinner className="text-white animate-spin" size={24} />
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
