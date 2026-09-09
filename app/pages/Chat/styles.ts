import styled from "styled-components";
import { customScrollbar } from "~/styles/customScrollbar";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background || "#0f0f12"};
  position: relative;
  overflow: hidden;
`;

export const ChatHeader = styled.header`
  height: 70px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.shape || "#18181b"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.heading || "#ffffff"};
  }

  span {
    font-size: 12px;
    color: ${(props) => props.theme.colors.dark_heading || "#a1a1aa"};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light_heading || "#a1a1aa"};
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
`;

export const MessagesScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${customScrollbar};
`;

export const MessageItemWrapper = styled.div`
  width: 100%;
`;

export const ScrollToBottomButton = styled.button`
  position: absolute;
  right: 24px;
  bottom: 85px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary || "#3b82f6"};
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }
`;