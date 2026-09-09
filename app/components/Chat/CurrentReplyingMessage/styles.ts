import styled from "styled-components";

export const ReplyingMessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors?.shape || "#18181b"};
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 6px;
  border-left: 3px solid ${(props) => props.theme.colors?.primary || "#3b82f6"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const ReplyingMessageContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const ReplyingMessageTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const ReplyingMessageTitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${(props) => props.theme.colors?.primary || "#3b82f6"};
  display: flex;
  align-items: center;
`;

export const ReplyingMessageAuthorNameWrapper = styled.div`
  margin-top: 2px;
`;

export const ReplyingMessageAuthorName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${(props) => props.theme.colors?.secondary || "#00b4d8"};
`;

export const ReplyingMessageWrapper = styled.div`
  width: 100%;
  margin-top: 2px;
`;

export const ReplyingMessageText = styled.p`
  font-size: 12px;
  line-height: 1.4;
  color: ${(props) => props.theme.colors?.light_heading || "#ffffff"};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ReplyingMessageRemoveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
`;

export const ReplyingMessageRemoveButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors?.red || "#ef4444"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;
