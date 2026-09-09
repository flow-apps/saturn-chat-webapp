import { NavLink } from "react-router";
import styled from "styled-components";

export const Container = styled.button`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  background: transparent;
`;

export const GroupInfos = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const GroupImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;

export const GroupName = styled.p`
  font-size: 17px;
  margin-left: 10px;
  color: ${(props) => props.theme.colors.dark_heading};
  width: 80%;
`;

export const UnreadMessages = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colors.primary};
  width: 50px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
`;

export const UnreadMessagesText = styled.p`
  color: #fff;
`;

export const HLWrapper = styled.div`
  display: flex;
`;
