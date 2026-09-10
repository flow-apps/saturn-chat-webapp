import styled from "styled-components";
import { NavLink } from "react-router";
import { customScrollbar } from "~/styles/customScrollbar";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.shape};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
`;

export const FriendsContainer = styled.div`
  width: 380px;
  height: 100%;
  background-color: ${(props) => props.theme.colors.shape};
  border-right: 1px solid ${(props) => props.theme.colors.shape || "#e1e1e1"};
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
`;

export const FriendsTitle = styled.h1`
  font-size: 26px;
  color: ${(props) => props.theme.colors.dark_heading};
  margin: 0 0 4px 0;
`;

export const FriendsSubtitle = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.light_heading};
  margin-bottom: 20px;
`;

export const QuickAccessFriendsContainer = styled.div`
  margin-bottom: 20px;
`;

export const QuickAccessTitle = styled.h3`
  font-size: 13px;
  color: ${(props) => props.theme.colors.light_heading};
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const QuickAccessFriendsScroll = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;

  ${customScrollbar};
`;

export const QuickAccessFriend = styled(NavLink)`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-right: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.shape};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 28px;
    object-fit: cover;
  }
`;

export const FriendHasMessageBadge = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 6px;
  border: 2px solid ${(props) => props.theme.colors.background};
`;

export const FriendsListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

export const EmptyTitle = styled.h4`
  font-size: 16px;
  color: ${(props) => props.theme.colors.dark_heading};
  margin-bottom: 8px;
  text-align: center;
`;

export const EmptySubtitle = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.colors.light_heading};
  text-align: center;
  line-height: 20px;
  margin: 0;
`;
