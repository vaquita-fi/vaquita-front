"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import WalletInfo from "./WalletInfo";
// import DrawerNavLinks from "./DrawerNavLinks";
import SocialLinks from "./SocialLinks";
import React from "react";

const MenuDrawer = ({
  children,
}: {
  children: (props: { onPress: () => void }) => React.ReactNode;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {children({ onPress: onOpen })}

      <Drawer
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        closeButton={
          <Image src="/close-circle.svg" alt="close" width={44} height={44} />
        }
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="text-lg font-semibold bg-background">
                Menu
              </DrawerHeader>

              <DrawerBody className="space-y-6 bg-background">
                <WalletInfo onClose={onClose} />
                {/* <DrawerNavLinks /> */}
                <SocialLinks />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MenuDrawer;
