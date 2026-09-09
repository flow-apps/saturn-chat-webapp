import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background || "#0f0f12"};
`;

export const AnimationView = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
