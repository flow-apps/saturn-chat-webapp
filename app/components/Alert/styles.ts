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

export const AlertModal = styled.div`
  width: 90%;
  max-width: 440px;
  min-height: 180px;
  background-color: ${(props) => props.theme.colors?.shape || "#18181b"};
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const AlertTitle = styled.h2`
  color: ${(props) => props.theme.colors?.light_heading || "#ffffff"};
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const AlertContent = styled.p`
  color: ${(props) => props.theme.colors?.dark_heading || "#a1a1aa"};
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-line;
  word-break: break-word;
`;

export const AlertButtonsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 24px;
`;

export const AlertOkButton = styled.button`
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors?.primary || "#3b82f6"};
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(59, 130, 246, 0.1);
  }
`;

export const AlertCancelButton = styled(AlertOkButton)`
  color: ${(props) => props.theme.colors?.red || "#ef4444"};

  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
`;

export const AlertExtraButton = styled(AlertOkButton)`
  color: ${(props) => props.theme.colors?.secondary || "#00b4d8"};
  margin-right: auto;

  &:hover {
    background-color: rgba(0, 180, 216, 0.1);
  }
`;

export const AlertOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
`;

export const AlertOptionButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 14px;
  color: ${(props) => props.theme.colors?.light_heading || "#ffffff"};
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: ${(props) => props.theme.colors?.primary || "#3b82f6"};
  }
`;