import { Button } from "@heroui/react";
import React from "react";

const LoginButton = ({
  ready,
  login,
}: {
  ready: boolean;
  login: () => void;
}) => {
  return (
    <div className="absolute left-0 z-10 flex justify-center w-full bottom-4">
      <div className="flex flex-col items-center w-full gap-2 mb-4">
        {ready ? (
          <Button
            size="lg"
            className="text-xl py-10 w-2/3 bg-primary hover:bg-secondary text-black rounded-md flex flex-col items-center justify-center border-[1px] border-black border-b-5"
            onPress={() => login()}
          >
            Login with email or passkey
          </Button>
        ) : (
          <p className="text-sm text-gray-400">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default LoginButton;
