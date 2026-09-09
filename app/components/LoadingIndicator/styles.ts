import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 100%;
`;

export const Spinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme?.colors?.primary || "#3b82f6"};
  animation: ${spin} 1s linear infinite;
`;