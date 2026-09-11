import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const SidebarContainer = styled.aside`
  width: 100%;
  max-width: 380px;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  border-left: 1px solid
    ${(props) => props.theme.colors.shape || "rgba(255, 255, 255, 0.08)"};
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  animation: slideLeft 0.25s ease-out;

  @keyframes slideLeft {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

export const SidebarHeader = styled.header`
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid
    ${(props) => props.theme.colors.shape || "rgba(255, 255, 255, 0.08)"};
`;

export const HeaderTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) =>
    props.theme.colors.dark_heading || props.theme.colors.black};
  margin: 0;
`;

export const Subtitle = styled.span`
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.light_heading || "#888"};
`;

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.black};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.black};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export const ContentBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ParticipantProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid
    ${(props) => props.theme.colors.shape || "rgba(255, 255, 255, 0.08)"};
`;

export const ParticipantAvatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const OptionsTitle = styled.h4`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.colors.light_heading || "#888"};
  margin: 0 0 6px 4px;
`;

export const OptionItem = styled.button<{
  $primary?: boolean;
  $danger?: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.shape || "rgba(255, 255, 255, 0.03)"};
  border: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
  color: ${(props) =>
    props.$danger
      ? props.theme.colors.red || "#ef4444"
      : props.$primary
        ? props.theme.colors.primary || "#3b82f6"
        : props.theme.colors.black};

  &:hover {
    background-color: ${(props) =>
      props.$danger
        ? "rgba(239, 68, 68, 0.1)"
        : props.$primary
          ? "rgba(59, 130, 246, 0.1)"
          : "rgba(255, 255, 255, 0.06)"};
    transform: translateY(-1px);
  }
`;

export const OptionText = styled.span<{
  $primary?: boolean;
  $danger?: boolean;
}>`
  font-size: 0.95rem;
  font-weight: 500;
  color: inherit;
`;
