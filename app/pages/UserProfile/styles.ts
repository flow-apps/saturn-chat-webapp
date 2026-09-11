import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  padding: 30px 20px;
  overflow-y: auto;
`;

export const ProfileCard = styled.div`
  width: 100%;
  max-width: 640px;
  background-color: ${(props) =>
    props.theme.colors.shape || "rgba(255, 255, 255, 0.03)"};
  border-radius: 16px;
  border: 1px solid
    ${(props) => props.theme.colors.shape || "rgba(255, 255, 255, 0.08)"};
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 40px;
`;

export const Banner = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    #1e1b4b 100%
  );
  position: relative;
`;

export const HeaderLeftActions = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 10px;
  z-index: 2;
`;

export const HeaderActions = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 10px;
  z-index: 2;
`;

export const IconButton = styled.button`
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition:
    background-color 0.2s,
    transform 0.1s;

  &:hover {
    background: rgba(0, 0, 0, 0.6);
    transform: scale(1.05);
  }
`;

export const AvatarWrapper = styled.div`
  margin-top: -75px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid ${(props) => props.theme.colors.background};
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  background-color: ${(props) => props.theme.colors.background};
  transition: transform 0.2s ease;
  z-index: 2;

  &:hover {
    transform: scale(1.03);
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BasicInfos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 14px;
  gap: 4px;
`;

export const NicknameText = styled.span`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.dark_heading || "#9ca3af"};
  font-style: italic;
`;

export const BioContainer = styled.div`
  padding: 0 30px;
  margin-top: 14px;
  text-align: center;
`;

export const BioContent = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.black};
  line-height: 1.5;
  margin: 0;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 20px;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

export const StatNumber = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.secondary || "#f59e0b"};
`;

export const StatLabel = styled.span`
  font-size: 0.85rem;
  color: ${(props) => props.theme.colors.dark_heading || "#9ca3af"};
`;

export const ActionsRow = styled.div`
  margin-top: 20px;
`;

export const ActionButton = styled.button<{
  $variant?: "primary" | "secondary" | "danger";
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;

  background-color: ${(props) =>
    props.$variant === "danger"
      ? props.theme.colors.red || "#ef4444"
      : props.$variant === "secondary"
        ? "rgba(255, 255, 255, 0.1)"
        : props.theme.colors.primary || "#3b82f6"};

  color: #fff;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

export const SectionContainer = styled.div`
  width: 100%;
  padding: 24px 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-top: 1px solid
    ${(props) => props.theme.colors.shape || "rgba(255, 255, 255, 0.08)"};
  margin-top: 24px;
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark_heading || "#9ca3af"};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

export const GroupCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${(props) => props.theme.colors.background};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
  }
`;

export const GroupAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export const GroupName = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.black};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

export const ImageModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
`;

export const FullImageContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;

  img {
    max-width: 100%;
    max-height: 90vh;
    border-radius: 12px;
    object-fit: contain;
  }
`;
