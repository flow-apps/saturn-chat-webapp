import styled from "styled-components";

export const FilesContainer = styled.div`
  position: relative;
  height: 100px;
  background-color: ${(props) => props.theme.colors?.shape || "#18181b"};
  padding: 8px 10px;
  border-radius: 10px;
  margin-top: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const FilesList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;