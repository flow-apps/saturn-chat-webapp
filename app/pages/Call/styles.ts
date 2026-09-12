import styled, { css } from "styled-components";

interface ControlButtonProps {
  isActive?: boolean;
}

interface GridCardProps {
  totalItems: number;
}

const getCardDimensions = (totalItems: number) => {
  if (totalItems === 1) {
    return css`
      width: 100%;
      height: 100%;
      max-width: 1280px;
      max-height: 720px;
    `;
  }

  if (totalItems === 2) {
    return css`
      width: calc(50% - 8px);
      height: 100%;
      max-height: 600px;

      @media (max-width: 768px) {
        width: 100%;
        height: calc(50% - 8px);
      }
    `;
  }

  if (totalItems <= 4) {
    return css`
      width: calc(50% - 8px);
      height: calc(50% - 8px);
      max-height: 400px;
    `;
  }

  if (totalItems <= 6) {
    return css`
      width: calc(33.333% - 10px);
      height: calc(50% - 8px);
      max-height: 360px;

      @media (max-width: 900px) {
        width: calc(50% - 8px);
        height: calc(33.333% - 8px);
      }
    `;
  }

  return css`
    width: calc(25% - 10px);
    height: calc(33.333% - 8px);
    max-height: 280px;

    @media (max-width: 1100px) {
      width: calc(33.333% - 10px);
      height: calc(33.333% - 8px);
    }

    @media (max-width: 768px) {
      width: calc(50% - 8px);
      height: calc(25% - 8px);
    }
  `;
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: #0f0f12;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
`;

export const Header = styled.header`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
`;

export const HeaderTitle = styled.h1`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.3px;
`;

export const ParticipantCount = styled.span`
  color: #a8a8b3;
  font-size: 13px;
  background-color: rgba(255, 255, 255, 0.08);
  padding: 4px 12px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
`;

export const GridContainer = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  padding: 80px 24px 100px 24px;
  gap: 12px;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

export const DirectCallContainer = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 72px 24px 96px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
`;

export const FullscreenCard = styled.div`
  width: 100%;
  height: 100%;
  background-color: #18181b;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const MiniCard = styled.div`
  position: absolute;
  right: 40px;
  bottom: 110px;
  width: 220px;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #18181b;
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0px 12px 28px rgba(0, 0, 0, 0.6);
  z-index: 10;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.04);
    border-color: ${(props) => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 130px;
    height: 170px;
    right: 32px;
    bottom: 100px;
  }
`;

export const ParticipantCard = styled.div<GridCardProps>`
  background-color: #18181b;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;

  ${({ totalItems }) => getCardDimensions(totalItems)}
`;

export const Avatar = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background-color: #27272a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const NameContainer = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background-color: rgba(0, 0, 0, 0.55);
  padding: 6px 14px;
  border-radius: 20px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-width: calc(100% - 24px);
`;

export const Name = styled.p`
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ControlsBar = styled.footer`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 16px;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(24, 24, 27, 0.85);
  border-radius: 40px;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 30;
`;

export const ControlButton = styled.button<ControlButtonProps>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : "rgba(255, 255, 255, 0.1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ isActive, theme }) =>
      isActive ? theme.colors.primary : "rgba(255, 255, 255, 0.2)"};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const EndCallButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) => props.theme.colors.red};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 8px;

  &:hover {
    background-color: ${(props) => props.theme.colors.red};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContainer = styled.div`
  width: 90%;
  max-width: 540px;
  max-height: 80vh;
  background-color: #18181b;
  border: 1px solid #ffffff1a;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
`;

export const ModalHeader = styled.div`
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ffffff14;
`;

export const ModalContent = styled.div`
  padding: 20px;
  overflow-y: auto;
`;
