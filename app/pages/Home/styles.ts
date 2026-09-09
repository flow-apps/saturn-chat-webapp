import { NavLink } from "react-router";
import styled from "styled-components";
import { customScrollbar } from "~/styles/customScrollbar";

export const MainContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
  overflow: hidden;
`;

export const GroupsContainer = styled.main`
  background-color: ${(props) => props.theme.colors.shape};
  height: 100vh;
  width: 450px;
  min-width: 450px;
  padding: 25px;

  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const GroupsTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.light_heading || "#ffffff"};
`;

export const GroupsSubtitle = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.dark_heading || "#a1a1aa"};
  margin-top: 4px;
  margin-bottom: 12px;
`;

export const QuickAccessGroupsContainer = styled.div`
  width: 100%;
  padding: 10px 0;
  margin-top: 10px;
  flex-shrink: 0;
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
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;

  ${customScrollbar};
`;

export const NewGroupButton = styled.button`
  width: 65px;
  height: 65px;
  min-width: 65px;
  border-radius: 50%;
  border: 2px dashed ${(props) => props.theme.colors.secondary || "#00b4d8"};
  background: transparent;
  color: ${(props) => props.theme.colors.secondary || "#00b4d8"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: scale(1.05);
  }
`;

export const QuickAccessGroup = styled(NavLink)`
  position: relative;
  flex-shrink: 0;

  img {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    object-fit: cover;
    aspect-ratio: 1 / 1;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

export const GroupHasMessageBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background-color: ${(props) => props.theme.colors.primary || "#3b82f6"};
  border: 2.5px solid ${(props) => props.theme.colors.shape || "#18181b"};
  border-radius: 50%;
`;

export const GroupsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 8px;

  flex: 1;
  overflow-y: auto;

  ${customScrollbar};
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 15px;
  text-align: center;
`;

export const EmptyTitle = styled.h3`
  font-size: 18px;
  color: ${(props) => props.theme.colors.light_heading || "#ffffff"};
  margin-bottom: 8px;
`;

export const EmptySubtitle = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.colors.dark_heading || "#a1a1aa"};
  line-height: 1.5;
`;

export const EmptyLink = styled.span`
  color: ${(props) => props.theme.colors.secondary || "#00b4d8"};
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

export const ChatArea = styled.section`
  flex: 1;
  height: 100vh;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background || "#0f0f12"};
`;