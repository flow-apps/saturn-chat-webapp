import { NavLink } from "react-router";
import styled, { css } from "styled-components";
import { customScrollbar } from "~/styles/customScrollbar";

export const Container = styled.div`
  max-height: 100vh;
  overflow-y: hidden;
`;

export const MainContainer = styled.div`
  display: flex;
`;

export const GroupsContainer = styled.main`
  background-color: ${(props) => props.theme.colors.shape};
  height: 100vh;
  width: 450px;
  padding: 25px;

  /* Habilita o Flexbox em coluna para permitir que a lista ocupe o espaço restante */
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const GroupsTitle = styled.h1``;

export const QuickAccessGroupsContainer = styled.div`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  justify-content: center;
  flex-shrink: 0; /* Impede que o acesso rápido encolha com o scroll da lista */
`;

export const QuickAccessTitle = styled.h2`
  font-size: 16px;
  color: ${(props) => props.theme.colors.dark_heading};
  margin-bottom: 15px;
`;

export const QuickAccessGroupsScroll = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  ${customScrollbar};
`;

export const QuickAccessGroup = styled(NavLink)`
  img {
    width: 65px;
    height: 65px;
    border-radius: 50%;
  }
  margin-right: 10px;
`;

export const GroupsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  flex: 1;
  overflow-y: auto;

  ${customScrollbar};
`;
