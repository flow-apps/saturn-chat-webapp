import React, { ButtonHTMLAttributes } from "react";
import { useTheme } from "styled-components";
import { ButtonText, Container, Spinner } from "./styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  textColor?: string;
  bgColor?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  textColor,
  bgColor,
  loading = false,
  disabled = false,
  type = "button",
  ...rest
}) => {
  const theme = useTheme();
  const isButtonDisabled = disabled || loading;
  const spinnerColor = textColor || theme?.colors?.white || "#FFF";

  return (
    <Container
      type={type}
      bgColor={bgColor}
      disabled={isButtonDisabled}
      {...rest}
    >
      {loading ? (
        <Spinner color={spinnerColor} />
      ) : (
        <ButtonText textColor={textColor}>{title}</ButtonText>
      )}
    </Container>
  );
};

export default Button;
