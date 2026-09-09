import styled from "styled-components";
import { colord } from "colord";

export const Container = styled.div`
  min-width: 260px;
  max-width: 320px;
  padding: 8px 14px;
  background-color: ${(props) =>
    colord(props.theme.colors?.shape).lighten(0.08).toRgbString()};
  border-radius: 12px;
  margin: 4px 0;
`;

export const AudioContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const AudioControllerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const AudioController = styled.button`
  background: ${(props) => props.theme.colors?.primary || "#3b82f6"};
  color: #ffffff;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

export const SeekBarContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const SeekBar = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  background-image: linear-gradient(
    ${(props) => props.theme.colors?.secondary || "#00b4d8"},
    ${(props) => props.theme.colors?.secondary || "#00b4d8"}
  );
  background-repeat: no-repeat;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors?.secondary || "#00b4d8"};
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
`;

export const AudioDurationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AudioDuration = styled.span`
  font-family: monospace;
  font-size: 11px;
  color: ${(props) => props.theme.colors?.light_heading || "#a1a1aa"};
`;
