import { css } from "styled-components";

export const customScrollbar = css`
  scrollbar-width: none;
  scrollbar-color: ${(props) => props.theme?.colors?.shape || "#18181b"};

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.theme?.colors?.light_heading || "rgba(255, 255, 255, 0.2)"};
    border-radius: 8px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme?.colors?.primary || "#3b82f6"};
  }
`;
