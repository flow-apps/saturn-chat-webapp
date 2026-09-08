// app/styles/global.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
  }

  html, body {
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
  }

  body {
    background-color: ${({ theme }) => theme?.colors?.background || "#121214"};
    color: ${({ theme }) => theme?.colors?.black || "#ffffff"};
    font-family: "Poppins", sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  input, button, textarea, select {
    border: 0;
    outline: 0;
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }

  h1, h2, h3 {
    font-family: "Roboto", sans-serif;
  }
`;
