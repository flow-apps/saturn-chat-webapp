import styled, { keyframes } from "styled-components";

const pulseAnimation = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const RecordingAudioContainer = styled.div`
  flex: 1;
  height: 40px;
  padding: 0 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  border: 1px solid ${({ theme }) => theme.colors?.red || "#ef4444"};
  border-radius: 20px;
  margin: 0 10px;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.15);
`;

export const RecordingAudioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RecordingPulseDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors?.red || "#ef4444"};
  animation: ${pulseAnimation} 1.5s infinite ease-in-out;
`;

export const RecordingAudioText = styled.span`
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  font-size: 14px;
  font-weight: 600;
`;

export const RecordingAudioDuration = styled.span`
  color: ${({ theme }) => theme.colors?.secondary || "#00b4d8"};
  font-size: 13px;
  font-family: monospace;
  font-weight: 600;
`;