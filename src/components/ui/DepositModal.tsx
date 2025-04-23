import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import Image from "next/image";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositConfirm: (amount: number) => void;
  // Podríamos necesitar el balance máximo aquí para el botón MAX
  // maxBalance?: number;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDepositConfirm,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleDepositClick = () => {
    const amount = Number(inputValue);
    if (!isNaN(amount) && amount > 0) {
      onDepositConfirm(amount);
    } else {
      // Manejar error de input inválido si es necesario
      console.error("Invalid deposit amount");
    }
  };

  const handlePresetClick = (amount: number) => {
    setInputValue(String(amount));
  };

  // const handleMaxClick = () => {
  //   if (maxBalance) {
  //     setInputValue(String(maxBalance));
  //   }
  // };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open: boolean) => !open && onClose()}
      placement="bottom"
      backdrop="blur"
      classNames={{
        wrapper: "bg-black/50 ",
        base: "bg-[#FEF9EF] rounded-lg border border-black shadow-lg px-2 py-4 max-w-sm mx-auto",
      }}
      // hideCloseButton={true}
      closeButton={
        <Image src="/close-circle.svg" alt="close" width={44} height={44} />
      }
    >
      <ModalContent className="flex gap-2">
        <ModalHeader className="flex px-4 py-0 mb-0">
          <span className="text-xl font-semibold text-center">Deposit</span>
        </ModalHeader>
        <ModalBody className="gap-2 px-4">
          <Input
            type="number"
            label="You're depositing"
            labelPlacement={"outside"}
            placeholder={"0"}
            value={inputValue}
            onValueChange={setInputValue}
            className="w-full"
            classNames={{
              input: " focus:ring-0 text-lg pl-3",
              inputWrapper: "border-none shadow-none px-0",
              innerWrapper: "border-1 border-black rounded-md bg-white",
            }}
            min="0"
            endContent={<span className="px-2">USDC</span>}
          />
          {/* </div> */}
          <div className="flex justify-between gap-2">
            {[1, 5].map((amount) => (
              <Button
                key={amount}
                onPress={() => handlePresetClick(amount)}
                className="flex-1 py-2 font-semibold text-black bg-white border border-b-2 border-black rounded-md shadow-sm hover:bg-gray-100"
              >
                ${amount}
              </Button>
            ))}
            <Button
              // onPress={handleMaxClick} // Implementar cuando tengamos el balance
              isDisabled={true}
              className="flex-1 py-2 font-semibold text-black bg-white border border-b-2 border-black rounded-md shadow-sm hover:bg-gray-100"
            >
              MAX
            </Button>
          </div>
        </ModalBody>
        <ModalFooter className="p-0 px-4 py-2">
          <Button
            onPress={handleDepositClick}
            className="w-full bg-success hover:bg-[#218838] text-black rounded-md py-6 text-xl font-bold border border-black shadow-md  border-b-4"
            isDisabled={!inputValue || Number(inputValue) <= 0}
          >
            Deposit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DepositModal;
