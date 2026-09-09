import styled from "styled-components";

export const FileContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: ${(props) =>
    (props.theme.colors?.dark_gray || "#4b5563") + "44"};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.8);
  }
`;
