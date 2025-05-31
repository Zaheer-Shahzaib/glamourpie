"use client";

import { ReactNode } from "react";

import { Center, Image, Stack } from "@mantine/core";

type AuthProps = {
  children: ReactNode;
};

function PasswordLayout({ children }: AuthProps) {
  return (
    <Center
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Stack>
        <Center>
          {/* <Image
            src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
            alt='DesignSparx logo'
            width={24}
            height={24}
            
          /> */}
        </Center>
        {children}
      </Stack>
    </Center>
  );
}

export default PasswordLayout;
