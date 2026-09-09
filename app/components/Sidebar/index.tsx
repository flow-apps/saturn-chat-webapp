import React from "react";
import { NavLink } from "react-router";
import {
  MessageSquare,
  UserPlus,
  Compass,
  Plus,
  Settings,
  Users2,
  UserRoundPlus,
  User2,
} from "lucide-react";
import { useAuth } from "~/contexts/auth";

import {
  AvatarContainer,
  AvatarImage,
  Container,
  IconButton,
  LogoContainer,
  LogoImage,
  NavContainer,
  NewChatButton,
  OnlineBadge,
  UserSection,
} from "./styles";

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      <LogoContainer>
        <LogoImage src={"/logo_alpha.png"} alt="Saturn Chat Logo" />
      </LogoContainer>

      <NavContainer>
        <NavLink to="/chats" end>
          {({ isActive }) => (
            <IconButton $active={isActive} title="Conversas">
              <Users2 size={22} />
            </IconButton>
          )}
        </NavLink>

        <NavLink to="/friends">
          {({ isActive }) => (
            <IconButton $active={isActive} title="Amigos">
              <User2 size={22} />
            </IconButton>
          )}
        </NavLink>

        <NavLink to="/explore">
          {({ isActive }) => (
            <IconButton $active={isActive} title="Explorar">
              <Compass size={22} />
            </IconButton>
          )}
        </NavLink>

        <NewChatButton title="Nova grupo">
          <Plus size={22} />
        </NewChatButton>
      </NavContainer>

      <UserSection>
        <NavLink to="/settings">
          {({ isActive }) => (
            <IconButton $active={isActive} title="Configurações">
              <Settings size={22} />
            </IconButton>
          )}
        </NavLink>

        <NavLink to="/profile">
          <AvatarContainer title={user?.name || "Perfil"}>
            <AvatarImage
              src={user?.avatar ? user.avatar.url : "/avatar-placeholder.jpg"}
              alt={user?.name || "Avatar"}
            />
            <OnlineBadge />
          </AvatarContainer>
        </NavLink>
      </UserSection>
    </Container>
  );
};

export default Sidebar;
