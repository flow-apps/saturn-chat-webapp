import { colord } from "colord";
import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.15s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const MessageOptionsContainer = styled.div`
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const MessageInfosContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  padding: 14px 16px;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const MessageAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const MessageInfos = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
  margin-bottom: 2px;
`;

export const MessageText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.dark_heading || "#a1a1aa"};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MessageOptionsModal = styled.div`
  padding: 8px;
  background-color: ${({ theme }) =>
    colord(theme.colors?.shape || "#18181b")
      .lighten(0.05)
      .toRgbString()};
  display: flex;
  flex-direction: column;
`;

export const Option = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export const OptionText = styled.span<{ $color?: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) =>
    props.$color
      ? props.$color
      : props.theme.colors?.light_heading || "#ffffff"};
`;
