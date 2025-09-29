"use client";

import React from "react";

import {
  Button,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft } from "@tabler/icons-react";

import { PATH_AUTH, PATH_DASHBOARD } from "../../../routes/index";

import classes from "./page.module.scss";
import Surface from "../../Surface/Surface";
import { Link, useNavigate } from "react-router-dom";
import PasswordLayout from "./layout";
import { log } from "console";
import { api } from "../../../Services/api";
import { notifications } from "@mantine/notifications";




function ForgetPassword() {

  const navigate = useNavigate();
  const theme = useMantineTheme();
  const mobile_match = useMediaQuery("(max-width: 425px)");
  const [email, setEmail] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  
  const handleclick = async () => {
    
    try {
    const respo = await api.post("/api/forgot-password", { email });
    console.log(respo);
    if (respo.status === 200) {
     notifications.show({
          title: "Success",
          message: "A reset link has been sent to your email!",
          color: theme.colors.green[4],
          position: "top-right",
        });
    }
    navigate(PATH_AUTH.signin);
    } catch (error: any) {
      const message = error.response?.data?.message;
      setErrorMessage(message || "An error occurred during login.");
    }
    
    

  }


  return (
    <>
      <>
        <title>Forgot your password</title>
        <meta
          name='description'
          content='Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!'
        />
      </>
      <PasswordLayout>
        <Title ta='center'>Forgot your password?</Title>
        <Text ta='center'>Enter your email to get a reset link</Text>

        <Surface
          component={Paper}
          className={classes.card}
        >
          <TextInput
            label='Your email'
            placeholder='me@email.com'
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Group
            justify='space-between'
            mt='lg'
            className={classes.controls}
          >
            <UnstyledButton
              component={Link}
              to={PATH_AUTH.signin}
              color='dimmed'
              className={classes.control}
            >
              <Group
                gap={2}
                align='center'
              >
                <IconChevronLeft
                  stroke={1.5}
                  style={{ width: rem(14), height: rem(14) }}
                />
                <Text
                  size='sm'
                  ml={5}
                >
                  Back to the login page
                </Text>
              </Group>
            </UnstyledButton>
            <Button
              
              fullWidth={mobile_match}
              onClick={handleclick}
            >
              Reset password
            </Button>
          </Group>
        </Surface>
      </PasswordLayout>
    </>
  );
}

export default ForgetPassword;
