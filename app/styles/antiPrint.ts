import { css } from "styled-components";

export const antiPrintStyles = css<{ $blocked?: boolean }>`
  ${(props) =>
    props.$blocked &&
    css`
      user-select: none;
      -webkit-user-select: none;

      img {
        pointer-events: none;
        -webkit-user-drag: none;
      }

      @media print {
        display: none !important;
      }
    `}
`;
