import styled from "styled-components";

interface ContainerProps {
  $align?: "center" | "right";
}

interface NameProps {
  $nameSize?: number;
  $color?: string;
}

export const Container = styled.div<ContainerProps>`
  display: inline-flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$align === "center"
      ? "center"
      : props.$align === "right"
      ? "flex-end"
      : "flex-start"};
  gap: 6px;
`;

export const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NicknameContainer = styled.div`
  display: flex;
`;

export const Name = styled.span<NameProps>`
  font-size: ${(props) => props.$nameSize || 16}px;
  font-weight: 600;
  color: ${(props) => props.$color || props.theme.colors?.light_heading || "#ffffff"};
  line-height: 1.2;
`;

export const NicknameText = styled.span`
  color: ${(props) => props.theme.colors?.dark_heading || "#a1a1aa"};
  font-weight: 500;
  font-size: 11px;
`;

export const EmblemContainer = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => props.theme.colors?.secondary || "#eab308"};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }
`;