import { NavLink } from "react-router";
import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
`;

export const LogoContainer = styled(NavLink)`
  display: flex;
  align-items: center;
`;

export const AppName = styled.p`
  color: ${(props) => props.theme.colors.black};
  font-size: 22px;
  font-weight: bold;
`;

export const Logo = styled.img`
  width: 100px;
  height: 100px;
`;
