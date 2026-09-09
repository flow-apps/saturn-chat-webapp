import styled from "styled-components";

export const MessageWrapper = styled.div<{ $isRight: boolean }>`
  display: flex;
  width: 100%;
  justify-content: ${(props) => (props.$isRight ? "flex-end" : "flex-start")};
  margin-bottom: 6px;
  position: relative;

  &:hover .hover-menu {
    opacity: 1;
    visibility: visible;
  }
`;

export const Container = styled.div<{ $isRight: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 60%;
  align-items: ${(props) => (props.$isRight ? "flex-end" : "flex-start")};
  position: relative;
`;

export const MessageContentContainer = styled.div<{
  $isRight: boolean;
  $sended: boolean;
  $hasPoll: boolean;
}>`
  background-color: ${(props) =>
    props.$isRight
      ? props.theme.colors.primary || "#3b82f6"
      : props.theme.colors.shape || "#18181b"};
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 12px;
  border-bottom-right-radius: ${(props) => (props.$isRight ? "2px" : "12px")};
  border-bottom-left-radius: ${(props) => (props.$isRight ? "12px" : "2px")};
  opacity: ${(props) => (props.$sended ? 1 : 0.6)};
  position: relative;
  word-break: break-word;
`;

export const ActionHoverMenu = styled.div`
  position: absolute;
  top: -14px;
  right: 10px;
  background-color: ${(props) => props.theme.colors.shape || "#27272a"};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 2px;
  gap: 2px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 5;
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light_heading || "#a1a1aa"};
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
`;

export const MessageAuthorContainer = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
`;

export const MessageAvatar = styled.img`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
`;

export const MessageDateContainer = styled.div`
  margin-top: 2px;
`;

export const MessageDate = styled.span`
  font-size: 10px;
  color: ${(props) => props.theme.colors.dark_heading || "#71717a"};
`;