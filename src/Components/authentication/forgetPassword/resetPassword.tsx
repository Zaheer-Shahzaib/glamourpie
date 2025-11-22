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
  useMantineTheme,
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
import { useForm } from "@mantine/form";

function ResetPassword() {
  const mobile_match = useMediaQuery("(max-width: 425px)");
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState<string | "">("");
  const [confirmPassword, setConfirmPassword] = useState<string | "">("");
  const [SearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = SearchParams.get("token");
  const email = SearchParams.get("email");

  const form = useForm({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },

    validate: {
      newPassword: (value: string) =>
        value.length < 12 ? "Password must be at least 12 characters" : null,

      confirmPassword: (value: any, values: any) =>
        value !== values.newPassword ? "Passwords do not match" : null,
    },
  });

  const handleClick = async (values: typeof form.values) => {
    console.log(token, email, newPassword, confirmPassword);
    try {
      if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }
      setErrorMessage(null);
      const resp = await api.post("/api/reset-password", {
        newPassword: values.newPassword,
        token,
        email,
      });

      notifications.show({
        title: "Success",
        message: "Password has been reset successfully!",
        color: theme.colors.green[4],
        position: "top-right",
      });

      navigate(PATH_AUTH.signin);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An error occurred. Please try again.";
      form.setErrors({
        newPassword: message,
      });
    }
  };

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
          <form onSubmit={form.onSubmit((values) => handleClick(values))}>
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
              type='password'
              placeholder='Enter new password'
              {...form.getInputProps("newPassword")}
              required
            />

            <TextInput
              label='Confirm Password'
              type='password'
              placeholder='Confirm your password'
              mt='md'
              {...form.getInputProps("confirmPassword")}
              required
            />
            <Group
              justify='center'
              mt='lg'
              className={classes.controls}
            >
              <Button
                type='submit'
                fullWidth={mobile_match}
              >
                Reset password
              </Button>
            </Group>
          </form>
        </Surface>
      </PasswordLayout>
    </>
  );
}

export default ResetPassword;
