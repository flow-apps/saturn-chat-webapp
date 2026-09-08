import styled, { keyframes } from "styled-components";

interface ContainerProps {
  textColor?: string;
  bgColor?: string;
  disabled?: boolean;
}

interface TextProps {
  textColor?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.button<ContainerProps>`
  width: 100%;
  padding: 16px 20px;
  background-color: ${(props) => {
    if (props.disabled) {
      return props.theme?.colors?.dark_gray || "#888888";
    }
    return props.bgColor || props.theme?.colors?.primary || "#121214";
  }};
  border: none;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: opacity 0.2s ease-in-out, background-color 0.2s ease-in-out;
  outline: none;

  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.9)};
  }

  &:active {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

export const ButtonText = styled.span<TextProps>`
  text-align: center;
  color: ${(props) => props.textColor || "#ffffff"};
  font-size: 18px;
  font-weight: 600;
  user-select: none;
`;

export const Spinner = styled.div<{ color?: string }>`
  width: 22px;
  height: 22px;
  border: 3px solid ${(props) => (props.color || "#ffffff") + "44"};
  border-top: 3px solid ${(props) => props.color || "#ffffff"};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;