import styled from "styled-components";

export const FormContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors?.background || "#0f0f12"};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 12px;
  border-radius: 24px;
  gap: 8px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  }
`;

export const PlusButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const MessageInput = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  font-size: 14px;
  font-family: inherit;
  resize: none;
  max-height: 120px;
  line-height: 1.4;

  &::placeholder {
    color: ${({ theme }) => theme.colors?.dark_heading || "#71717a"};
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const OptionsButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const SendButton = styled.button`
  background: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  border: none;
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

export const AudioContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const AudioButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.secondary || "#00b4d8"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const FileSendedProgressContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
`;

export const FileSendedText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.secondary || "#00b4d8"};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background-color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  transition: width 0.2s ease;
`;

export const NoSendMessageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  width: 100%;
  padding: 16px;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  text-align: center;
`;

export const NoSendMessageText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.dark_heading || "#a1a1aa"};
`;

export const ActionsPopoverOverlay = styled.div`
  position: absolute;
  bottom: 60px;
  left: 16px;
  z-index: 100;
`;

export const ActionsPopover = styled.div`
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
`;

export const ActionItemButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export const ActionIconContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) =>
    (theme.colors?.primary || "#3b82f6") + "20"};
  color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActionText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
`;
