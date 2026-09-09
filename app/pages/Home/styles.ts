import { NavLink } from "react-router";
import styled, { css } from "styled-components";
import { customScrollbar } from "~/styles/customScrollbar";

export const Container = styled.div``;

export const MainContainer = styled.div`
  display: flex;
`;

export const GroupsContainer = styled.main`
  background-color: ${(props) => props.theme.colors.shape};
  height: 100vh;
  width: 450px;
  padding: 25px;
`;

export const GroupsTitle = styled.h1``;

export const QuickAccessGroupsContainer = styled.div`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  justify-content: center;
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
