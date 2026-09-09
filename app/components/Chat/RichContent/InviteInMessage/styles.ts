import styled from "styled-components";

interface AcceptInviteButtonProps {
  $participating?: boolean;
}

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors?.shape || "#18181b"};
  padding: 12px;
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
  margin-top: 6px;
  min-height: 80px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
`;

export const InviteTitle = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  color: ${(props) => props.theme.colors?.dark_heading || "#a1a1aa"};
  text-transform: uppercase;
`;

export const GroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const GroupRightSideContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const GroupLeftSideContainer = styled.div`
  margin-left: 12px;
  flex: 1;
  min-width: 0;
`;

export const GroupAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export const GroupName = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: ${(props) => props.theme.colors?.light_heading || "#ffffff"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

export const GroupDescription = styled.p`
  font-size: 11px;
  color: ${(props) => props.theme.colors?.dark_heading || "#a1a1aa"};
  margin: 2px 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const AcceptInviteButton = styled.button<AcceptInviteButtonProps>`
  background-color: ${(props) =>
    props.$participating
      ? props.theme.colors?.dark_heading || "#4b5563"
      : props.theme.colors?.secondary || "#00b4d8"};
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: ${(props) => (props.$participating ? "default" : "pointer")};
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    opacity: ${(props) => (props.$participating ? "1" : "0.9")};
    transform: ${(props) =>
      props.$participating ? "none" : "translateY(-1px)"};
  }

  &:active {
    transform: translateY(0);
  }
`;
