import React, { useState, InputHTMLAttributes } from "react";
import { useTheme } from "styled-components";
import { Eye, EyeOff } from "lucide-react";
import {
  Container,
  InputContainer,
  Label,
  MainInput,
  ShowPasswordButton,
} from "./styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  onFocus,
  onBlur,
  id,
  ...rest
}) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordInput = type === "password";
  const currentType = isPasswordInput
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <Container>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputContainer>
        <MainInput
          id={id}
          type={currentType}
          focused={focused}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {isPasswordInput && (
          <ShowPasswordButton
            type="button"
            onClick={() => setShowPassword((old) => !old)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors?.black || "#000"} />
            ) : (
              <Eye size={20} color={colors?.black || "#000"} />
            )}
          </ShowPasswordButton>
        )}
      </InputContainer>
    </Container>
  );
};

export default Input;