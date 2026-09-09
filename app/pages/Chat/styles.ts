import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors?.background || "#0f0f12"};
  position: relative;
  overflow: hidden;
`;

export const ChatHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 12px;
  z-index: 10;
`;

export const GroupAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const HeaderInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  min-width: 0;

  h3 {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    font-size: 12px;
    color: ${({ theme }) => theme.colors?.dark_heading || "#a1a1aa"};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.light_heading || "#a1a1aa"};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export const MessagesScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column-reverse; /* Força o alinhamento de baixo para cima */
  gap: 8px;

  /* Estilização da barra de rolagem */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const MessageItemWrapper = styled.div`
  width: 100%;
`;

export const ScrollToBottomButton = styled.button`
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 20;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.08);
  }
`;