"use client";

import React, { use } from "react";

import {
  Button,
  Alert,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  rem,
  useMantineTheme
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconInfoCircle } from "@tabler/icons-react";

import { PATH_AUTH, PATH_DASHBOARD } from "../../../routes/index";

import classes from "./page.module.scss";
import Surface from "../../Surface/Surface";
import { Link } from "react-router-dom";
import PasswordLayout from "./layout";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../../Services/api";
import { notifications } from "@mantine/notifications";
import { set } from "lodash";



function ResetPassword() {
  const mobile_match = useMediaQuery("(max-width: 425px)");
  const theme = useMantineTheme();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState<string | ''>('')
  const [confirmPassword, setConfirmPassword] = useState<string | ''>('')
  const [SearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = SearchParams.get('token')
  const email = SearchParams.get('email')



  const handleClick = async () => {
    console.log(token, email, newPassword, confirmPassword)
    try { 
      if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }else if(!newPassword){
        setErrorMessage("Password cannot be empty");
        return;
      }
      setErrorMessage(null);
      
      const respo = await api.post('/api/reset-password', { newPassword, token, email })
      console.log("response",respo);
      if (respo.status === 200) {
        notifications.show({
          title: "Success",
          message: "Password has been reset successfully!",
          color: theme.colors.green[4],
          position: "top-right",
        });
      }
      navigate(PATH_AUTH.signin);

    } catch (error: any) {
      const message = error.response?.data?.message;
      setErrorMessage(message || "An error occurred. Please try again.");
    }


  }




  return (
    <>
      <>
        <title>Password Reset</title>
        <meta
          name='description'
          content='Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!'
        />
      </>
      <PasswordLayout>
        <Title ta='center'>Reset your password?</Title>
        <Text ta='center'>Enter your new password to reset!</Text>

        <Surface
          component={Paper}
          className={classes.card}
        >
          {errorMessage && (
            <Alert
              variant='light'
              c={theme.colors.red[8]}
              radius='lg'
              title=''
              icon={<IconInfoCircle />}
            >
              {errorMessage}
            </Alert>
          )}
          <TextInput
            label='New Password'
            placeholder='Enter new password'
            type="password"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.currentTarget.value)}

          />
          <TextInput
            label='Confirm Password'
            placeholder='Confirm your password'
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          />
          <Group
            justify='center'
            mt='lg'
            className={classes.controls}
          >
            {/* <UnstyledButton
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
            </UnstyledButton> */}
            <Button
              onClick={handleClick}
              fullWidth={mobile_match}
            >
              Reset password
            </Button>
          </Group>
        </Surface>
      </PasswordLayout>
    </>
  );
}

export default ResetPassword;
