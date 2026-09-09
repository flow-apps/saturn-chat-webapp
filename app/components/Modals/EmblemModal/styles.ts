import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalCardContainer = styled.div`
  background-color: ${(props) => props.theme.colors?.shape || "#18181b"};
  width: 90%;
  max-width: 420px;
  border-radius: 12px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const ModalAnimationContainer = styled.div`
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100% !important;
    height: 100% !important;
  }
`;

export const ModalTitle = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors?.light_heading || "#ffffff"};
  margin: 12px 0;
`;

export const ModalContent = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${(props) => props.theme.colors?.dark_heading || "#a1a1aa"};
  text-align: center;
  margin: 0 0 16px 0;
`;

export const ModalButton = styled.button`
  width: 100%;
  background-color: ${(props) => props.theme.colors?.primary || "#3b82f6"};
  color: #ffffff;
  padding: 12px;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;