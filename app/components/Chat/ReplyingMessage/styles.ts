import { colord } from "colord";
import styled from "styled-components";

export const Container = styled.div`
  border-left: 3px solid
    ${({ theme }) => theme.colors?.light_primary || "#60a5fa"};
  padding: 8px 12px;
  width: 100%;
  max-width: 90%;
  background-color: ${({ theme }) =>
    colord(theme.colors?.shape || "#18181b")
      .darken(0.03)
      .toRgbString()};
  margin: 6px 0;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
`;

export const ReplyingTitleContainer = styled.div`
  margin-bottom: 2px;
`;

export const ReplyingTitle = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.dark_heading || "#a1a1aa"};
  display: flex;
  align-items: center;
  font-weight: 500;
`;

export const ReplyingMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ReplyingMessageAuthorWrapper = styled.div``;

export const ReplyingMessageAuthorName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.secondary || "#00b4d8"};
`;

export const ReplyingMessageContentContainer = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
`;

export const ReplyingMessageContent = styled.p<{ $readAll?: boolean }>`
  font-size: 12px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  margin: 0;
  word-break: break-word;

  ${(props) =>
    !props.$readAll &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

export const ReadMoreButton = styled.button`
  background: transparent;
  border: none;
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.dark_heading || "#71717a"};
  cursor: pointer;
  padding: 0;
  margin-top: 2px;
  align-self: flex-start;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  }
`;
