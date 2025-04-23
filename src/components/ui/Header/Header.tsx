"use client";
import React from "react";
import { HiMenu } from "react-icons/hi";
import { Button } from "@heroui/react";
import MenuDrawer from "./MenuDrawer";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-black">
      <h1 className="text-2xl font-bold sm:text-3xl">Vaquita</h1>

      <MenuDrawer>
        {({ onPress }) => (
          <Button
            isIconOnly
            onPress={onPress}
            className="hover:bg-primary bg-background"
          >
            <HiMenu className="w-10 h-10 p-2 sm:w-14 sm:h-14 sm:p-1" />
          </Button>
        )}
      </MenuDrawer>
    </header>
  );
};

export default Header;
