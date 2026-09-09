import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors?.shape || "#18181b"};
  padding: 12px 14px;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  margin-top: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
`;

export const WebsiteNameContainer = styled.div`
  margin-bottom: 4px;
`;

export const WebsiteName = styled.span`
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => props.theme.colors?.dark_heading || "#a1a1aa"};
`;

export const WebsiteHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
`;

export const WebsiteFaviconContainer = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const WebsiteFavicon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
`;

export const WebsiteTitleContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
`;

export const WebsiteTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: ${(props) => props.theme.colors?.primary || "#3b82f6"};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    text-decoration: underline;
  }
`;

export const WebsiteDescriptionContainer = styled.div`
  margin-top: 6px;
`;

export const WebsiteDescription = styled.p`
  font-size: 12px;
  line-height: 1.4;
  color: ${(props) => props.theme.colors?.light_heading || "#ffffff"};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const WebsiteImageContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const WebsiteImage = styled.img`
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
`;

export const VideoIndicatorContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  cursor: pointer;
`;

export const VideoIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const VideoIndicatorText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
`;
