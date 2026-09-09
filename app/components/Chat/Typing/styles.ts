import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors?.shape || "#18181b"};
  padding: 6px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

export const TypingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 100%;
`;

export const TypingLeftSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 24px;
  margin-left: -5px;

  svg {
    width: 100% !important;
    height: 100% !important;
  }
`;

export const TypingRightSide = styled.div`
  display: flex;
  align-items: center;
  margin-left: 6px;
  min-width: 0;
  flex: 1;
`;

export const TypingUsersContainer = styled.div`
  min-width: 0;
  width: 100%;
`;

export const TypingUsersText = styled.span`
  font-size: 13px;
  color: ${(props) => props.theme.colors?.dark_heading || "#a1a1aa"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;