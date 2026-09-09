import styled from "styled-components";

export const MessageMarkContainer = styled.div<{ $isRight: boolean }>`
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
`;

export const MessageContent = styled.p<{ $isRight: boolean }>`
  margin: 0;
  color: #ffffff;
  white-space: pre-wrap;
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
  background-color: rgba(0, 0, 0, 0.25);
  color: #f43f5e;
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

export const ExpandButton = styled.button<{ $isRight: boolean }>`
  background: transparent;
  border: none;
  margin-top: 4px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => (props.$isRight ? "#e0f2fe" : "#0284c7")};
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;
