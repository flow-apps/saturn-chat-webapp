import { colord } from "colord";
import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ theme }) =>
    colord(theme.colors?.shape || "#18181b")
      .darken(0.03)
      .toRgbString()};
  height: 38px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-top: -6px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: none;
`;

export const AudioPreviewContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const AudioPreviewControllersWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AudioPreviewButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const AudioPreviewSeekContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const AudioPreviewSeek = styled.input`
  width: 100%;
  height: 3px;
  border-radius: 2px;
  appearance: none;
  background: rgba(255, 255, 255, 0.15);
  background-image: linear-gradient(
    ${({ theme }) => theme.colors?.primary || "#3b82f6"},
    ${({ theme }) => theme.colors?.primary || "#3b82f6"}
  );
  background-repeat: no-repeat;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors?.secondary || "#00b4d8"};
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
`;

export const AudioPreviewDurationContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const AudioPreviewDuration = styled.span`
  font-family: monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.dark_heading || "#a1a1aa"};
`;
