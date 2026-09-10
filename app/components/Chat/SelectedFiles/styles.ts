import styled from "styled-components";

export const FileContainer = styled.div`
  position: relative;
  height: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: ${(props) =>
    (props.theme.colors?.shape || "#4b5563") + "44"};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ffffff14;
  flex-shrink: 0;
  flex: 1;
`;

export const ImageFile = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

export const OtherFile = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors?.light_heading || "#ffffff"};
`;

export const RemoveFileButton = styled.button`
  width: 22px;
  height: 22px;
  position: absolute;
  z-index: 5;
  top: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${(props) => props.theme.colors?.secondary || "#00b4d8"};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.8);
  }
`;