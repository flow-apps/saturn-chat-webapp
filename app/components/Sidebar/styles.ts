import styled from "styled-components";

export const Container = styled.aside`
  width: 72px;
  height: 100vh;
  background-color: ${(props) => props.theme?.colors?.shape || "#18181b"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  user-select: none;
`;

export const LogoContainer = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 12px;

  a {
    text-decoration: none;
  }
`;

export const IconButton = styled.div<{ $active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  background-color: ${(props) =>
    props.$active ? props.theme?.colors?.primary || "#3b82f6" : "transparent"};

  color: ${(props) =>
    props.$active
      ? "#ffffff"
      : props.theme?.colors?.light_heading || "#a1a1aa"};

  &:hover {
    background-color: ${(props) =>
      props.$active
        ? props.theme?.colors?.primary || "#3b82f6"
        : "rgba(255, 255, 255, 0.05)"};
    color: #ffffff;
  }
`;

export const NewChatButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  border: 1.5px dashed
    ${(props) => props.theme?.colors?.light_heading || "#3f3f46"};
  background: transparent;
  color: ${(props) => props.theme?.colors?.light_heading || "#a1a1aa"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-top: 4px;

  &:hover {
    border-color: #ffffff;
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

export const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: auto;

  a {
    text-decoration: none;
  }
`;

export const AvatarContainer = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  cursor: pointer;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
`;

export const OnlineBadge = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #22c55e;
  border: 2px solid ${(props) => props.theme?.colors?.shape || "#18181b"};
  border-radius: 50%;
`;
