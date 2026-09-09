import { colord } from "colord";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 8px 12px;
  background-color: ${(props) =>
    colord(props.theme.colors?.shape || "#18181b")
      .lighten(0.08)
      .toRgbString()};
  border-radius: 10px;
  margin: 6px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const FileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FileIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors?.light_heading || "#ffffff"};
`;

export const FileInfosContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Permite que o text-overflow: ellipsis funcione */
`;

export const FileName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.colors?.light_heading || "#ffffff"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FileSize = styled.span`
  font-size: 11px;
  color: ${(props) => props.theme.colors?.primary || "#3b82f6"};
  margin-top: 2px;
`;

export const FileOpenAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FileButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors?.secondary || "#00b4d8"};
  padding: 2px;
  border-radius: 6px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const FileImagePreview = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
`;

export const VideoPreviewWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PlayIconOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
`;
