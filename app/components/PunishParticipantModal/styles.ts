import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalCard = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.black};
  width: 100%;
  max-width: 440px;
  max-height: 85vh;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  border: 1px solid
    ${(props) => props.theme.colors.shape || "rgba(255, 255, 255, 0.08)"};
  animation: scaleUp 0.2s ease-out;

  @keyframes scaleUp {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const ModalHeader = styled.div`
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid
    ${(props) => props.theme.colors.shape || "rgba(255, 255, 255, 0.08)"};
  flex-shrink: 0;
`;

export const ModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.red || "#ef4444"};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.black};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition:
    background-color 0.2s,
    transform 0.1s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  &:active {
    transform: scale(0.92);
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
  }
`;

export const IconWrapper = styled.div`
  color: ${(props) => props.theme.colors.red || "#ef4444"};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 50%;
  background-color: rgba(239, 68, 68, 0.1);
`;

export const Description = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.black};
  text-align: center;
  margin: 0;
  line-height: 1.5;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
`;

export const CheckboxInput = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: ${(props) => props.theme.colors.primary};
`;

export const CheckboxLabel = styled.label`
  font-size: 0.88rem;
  color: ${(props) => props.theme.colors.dark_heading || "#9ca3af"};
  cursor: pointer;
  user-select: none;
`;

export const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 8px;
`;

export const ConfirmButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.red || "#ef4444"};
  color: #fff;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;

  &:hover:not(:disabled) {
    opacity: 0.92;
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.shape || "rgba(255, 255, 255, 0.05)"};
  color: ${(props) => props.theme.colors.black};
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
