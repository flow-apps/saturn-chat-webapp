import { colord } from "colord";
import styled from "styled-components";

interface ProgressBarProps {
  $percentage: number;
  $isSelected: boolean;
}

export const Container = styled.div`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const QuestionText = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  margin: 0;
`;

export const SubtitleText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.dark_heading || "#9ca3af"};
  margin-top: -4px;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;

export const OptionButton = styled.button`
  position: relative;
  background-color: ${({ theme }) =>
    colord(theme.colors?.shape || "#1f2937")
      .darken(0.03)
      .toRgbString()};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 14px;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.2s ease,
    transform 0.1s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const ProgressBar = styled.div<ProgressBarProps>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${(props) => props.$percentage}%;
  background-color: ${(props) =>
    props.$isSelected
      ? (props.theme.colors?.primary || "#3b82f6") + "40"
      : (props.theme.colors?.secondary || "#00b4d8") + "25"};
  border-radius: 10px;
  transition:
    width 0.35s ease-in-out,
    background-color 0.2s ease;
`;

export const OptionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 100%;
`;

export const OptionInfo = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  margin-right: 8px;
  color: ${(props) =>
    props.$isSelected
      ? props.theme.colors?.primary || "#3b82f6"
      : props.theme.colors?.dark_heading || "#9ca3af"};
`;

export const OptionText = styled.span<{ $isSelected: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  font-weight: ${(props) => (props.$isSelected ? "600" : "400")};
`;

export const PercentageText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.dark_heading || "#9ca3af"};
  white-space: nowrap;
`;

export const TotalVotesText = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.dark_heading || "#9ca3af"};
  text-align: right;
  margin-top: 2px;
`;
