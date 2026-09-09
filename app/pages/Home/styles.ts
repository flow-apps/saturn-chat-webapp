import styled from "styled-components";

export const Container = styled.div``;

export const MainContainer = styled.div`
  display: flex;
`;

export const GroupsContainer = styled.main`
  background-color: ${(props) => props.theme.colors.shape};
  height: 100vh;
  width: 450px;
`;

export const GroupsTitle = styled.h1``;
