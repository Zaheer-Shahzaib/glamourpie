import { useState } from "react";
import { Flex, Text, Progress } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { keyframes } from "@emotion/react";

interface Props {
  password: string;
  focused: boolean;
}

export default function PasswordRules({ password, focused }: Props) {
  const [animateCheck] = useState(() =>
    keyframes({
      "0%": { transform: "scale(0)" },
      "100%": { transform: "scale(1)" },
    })
  );

  if (!focused) return null; 

  const rules = [
    {
      label: "At least 12 characters",
      valid: password.length >= 12,
    },
    {
      label: "Contains one uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Contains one number",
      valid: /\d/.test(password),
    },
    {
      label: "Contains one special character (! @ # $ % ^ & *)",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  // Password strength calculation
  const passedRules = rules.filter((r) => r.valid).length;
  const strengthLevels = ["Weak", "Medium", "Strong"];
  const strengthIndex =
    passedRules <= 1 ? 0 : passedRules === 2 || passedRules === 3 ? 1 : 2;
  const strengthColors = ["red", "orange", "green"];

  return (
    <div
      style={{
        marginTop: "10px",
        background: "#f8f9fa",
        padding: "12px 16px",
        borderRadius: "8px",
        // border: "1px solid #e1e5eb",
      }}
    >
      {/* <Text fw={500} mb={6}>
        Password Requirements:
      </Text> */}

      {rules.map((rule, index) => (
        <Flex key={index} align="center" gap={6} mb={4}>
          {rule.valid ? (
            <IconCheck
              size={18}
              color="green"
              style={{ animation: `${animateCheck} 0.3s ease-in-out` }}
            />
          ) : (
            <IconX size={18} color="red" />
          )}
          <Text size="sm" style={{ color: rule.valid ? "green" : "red" }}>
            {rule.label}
          </Text>
        </Flex>
      ))}

      <Text fw={500} mt={6}>
        <span style={{ color: strengthColors[strengthIndex] }}>
          {strengthLevels[strengthIndex]}
        </span>
      </Text>

      <Progress
        value={(passedRules / rules.length) * 100}
        mt="xs"
        radius="sm"
        color={strengthColors[strengthIndex]}
        size={8}
      />
    </div>
  );
}
