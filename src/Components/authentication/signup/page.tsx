"use client";

import {
  Button,
  Center,
  Flex,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  TextProps,
  Title,
} from "@mantine/core";

import classes from "./page.module.scss";
import Surface from "../../Surface/Surface";
import SignUpLayout from "./layout";
import { Link } from "react-router-dom";

function SignupPage() {
  const LINK_PROPS: TextProps = {
    className: classes.link,
  };

  return (
    <>
      <>
        <title>Sign up | DesignSparx</title>
        <meta
          name='description'
          content='Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!'
        />
      </>
      <SignUpLayout>
        <Title ta='center'>Welcome!</Title>
        <Text ta='center'>Create your account to continue</Text>

        <Surface
          component={Paper}
          className={classes.card}
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap={{ base: "md" }}
          >
            <TextInput
              label='First name'
              placeholder='John'
              required
              classNames={{ label: classes.label }}
            />
            <TextInput
              label='Last name'
              placeholder='Doe'
              required
              classNames={{ label: classes.label }}
            />
          </Flex>
          <TextInput
            label='Email'
            placeholder='you@mantine.dev'
            required
            mt='md'
            classNames={{ label: classes.label }}
          />
          <PasswordInput
            label='Password'
            placeholder='Your password'
            required
            mt='md'
            classNames={{ label: classes.label }}
          />
          <PasswordInput
            label='Confirm Password'
            placeholder='Confirm password'
            required
            mt='md'
            classNames={{ label: classes.label }}
          />
          <Button
            fullWidth
            mt='xl'
            component={Link}
            to={"PATH_DASHBOARD.default"}
          >
            Create account
          </Button>
          <Center mt='md'>
            <Text
              size='sm'
              component={Link}
              to={"/"}
              {...LINK_PROPS}
            >
              Already have an account? Sign in
            </Text>
          </Center>
        </Surface>
      </SignUpLayout>
    </>
  );
}

export default SignupPage;
