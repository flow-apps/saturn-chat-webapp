import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.15s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors?.background || "#1f2937"};
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  max-height: 85vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.dark_heading || "#9ca3af"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const FormContent = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.dark_heading || "#9ca3af"};
  margin-bottom: 6px;
`;

export const Input = styled.input`
  background-color: ${({ theme }) => theme.colors?.shape || "#374151"};
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  margin-bottom: 18px;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  }
`;

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

export const OptionInput = styled.input`
  flex: 1;
  background-color: ${({ theme }) => theme.colors?.shape || "#374151"};
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  }
`;

export const RemoveOptionButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.red || "#ef4444"};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
`;

export const AddOptionButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  margin-bottom: 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const AddOptionText = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

export const MultipleChoiceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid ${({ theme }) => theme.colors?.light_gray || "rgba(255, 255, 255, 0.1)"};
  margin-bottom: 20px;
`;

export const MultipleChoiceText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #4b5563;
    transition: 0.3s;
    border-radius: 24px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: ${({ theme }) => theme.colors?.secondary || "#00b4d8"};
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }
`;

export const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  color: #ffffff;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.99);
  }
`;