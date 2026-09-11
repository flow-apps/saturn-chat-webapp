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
  max-width: 480px;
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
  color: ${(props) => props.theme.colors.primary || "#3b82f6"};
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
  padding: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;

  /* Scrollbar Fina e Personalizada */
  scrollbar-width: thin;
  scrollbar-color: ${(props) =>
    `${props.theme.colors.shape || "rgba(255, 255, 255, 0.2)"} transparent`};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) =>
      props.theme.colors.shape || "rgba(255, 255, 255, 0.15)"};
    border-radius: 8px;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.dark_heading || "#9ca3af"};
  margin: 0;
  line-height: 1.5;

  strong {
    color: ${(props) => props.theme.colors.black};
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.dark_heading || "#9ca3af"};
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid
    ${(props) => props.theme.colors.shape || "rgba(255, 255, 255, 0.1)"};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.black};
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => `${props.theme.colors.primary}33`};
  }

  option {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.black};
    padding: 8px;
  }
`;

export const RoleInfoBox = styled.div`
  padding: 16px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.shape || "rgba(255, 255, 255, 0.03)"};
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RoleInfoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.secondary || "#f59e0b"};
  margin: 0;
`;

export const RoleDescription = styled.p`
  font-size: 0.85rem;
  color: ${(props) => props.theme.colors.black};
  margin: 0;
  line-height: 1.4;
`;

export const PermissionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
`;

export const PermissionItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: ${(props) =>
    props.$active
      ? props.theme.colors.black
      : props.theme.colors.dark_heading || "#6b7280"};
  opacity: ${(props) => (props.$active ? 1 : 0.6)};

  svg {
    color: ${(props) =>
      props.$active
        ? props.theme.colors.green || "#22c55e"
        : props.theme.colors.red || "#ef4444"};
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primary};
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
