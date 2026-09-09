import styled from "styled-components";

export const AudioRecordingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  border-radius: 24px;
  padding: 8px 16px;
  min-height: 48px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

export const CancelAudioButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.red || "#ef4444"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

export const SendAudioButton = styled.button`
  background-color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;