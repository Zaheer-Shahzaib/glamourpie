'use client';

import { ReactNode } from 'react';

import { Center, Image, Stack } from '@mantine/core';

type AuthProps = {
  children: ReactNode;
};

function SignInLayout({ children }: AuthProps) {
  return (
    <Center
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Stack>
        <Center>
          <Image
            src="/logo-no-background.png"
            alt="DesignSparx logo"
            width={96}
            height={96}
            style={{ objectFit: 'contain' }}
          />
        </Center>
        {children}
      </Stack>
    </Center>
  );
}

export default SignInLayout;
