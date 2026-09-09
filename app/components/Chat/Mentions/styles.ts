import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  max-width: 320px;
  background-color: ${({ theme }) => theme.colors?.shape || "#18181b"};
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  z-index: 50;
`;

export const UserList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 4px;

  /* Estilização da barra de rolagem */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

export const UserContainer = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.15s ease;
  text-align: left;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const Nickname = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.light_heading || "#ffffff"};
`;

export const NoResultsText = styled.p`
  padding: 16px;
  text-align: center;
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.dark_heading || "#a1a1aa"};
`;
