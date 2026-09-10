import styled from "styled-components";

interface MessageContainerProps {
  $isRight?: boolean;
}

export const MessageMarkdownContainer = styled.div<MessageContainerProps>`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
  color: ${(props) => props.theme.colors.black};

  ul,
  ol {
    margin: 4px 0;
    padding-left: 18px;
    list-style-position: outside;
    box-sizing: border-box;
  }

  li {
    margin-bottom: 2px;
    padding-left: 2px;
    word-break: break-word;
    overflow-wrap: anywhere;

    p {
      display: inline;
      margin: 0;
      color: ${(props) => props.theme.colors.black};
    }
  }

  p {
    margin: 0 0 4px 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const MessageContent = styled.p<MessageContainerProps>`
  margin: 0;
  color: ${(props) => props.theme.colors.black};
`;

export const ExpandButton = styled.button<MessageContainerProps>`
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  color: ${({ theme, $isRight }) =>
    $isRight
      ? theme.colors?.secondary || "#00b4d8"
      : theme.colors?.primary || "#3b82f6"};

  &:hover {
    text-decoration: underline;
  }
`;

export const MessageLink = styled.a`
  color: ${(props) => props.theme.colors.secondary || "#38bdf8"};
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    opacity: 0.8;
  }
`;

export const MessageCodeInline = styled.code`
  background-color: #00000040;
  color: ${props => props.theme.colors.dark_heading};
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
`;

export const MessageCodeBlock = styled.pre`
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10px 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 6px 0;
`;

export const MessageCodeBlockText = styled.code`
  color: #34d399;
  font-family: monospace;
  font-size: 13px;
  white-space: pre;
`;
