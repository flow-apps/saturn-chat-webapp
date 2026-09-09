import React from "react";
import { NavLink } from "react-router";
import { Compass, Plus, Settings, Users2, User2 } from "lucide-react";
import { useAuth } from "~/contexts/auth";

import {
  AvatarContainer,
  AvatarImage,
  Container,
  IconButton,
  LogoContainer,
  LogoImage,
  NavContainer,
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
        {/* 1º Botão: / (Conversas) */}
        <NavLink to="/" end>
          {({ isActive }) => (
            <IconButton $active={isActive} title="Conversas">
              <Users2 size={22} />
            </IconButton>
          )}
        </NavLink>

        {/* 2º Botão: /friends (Amigos) */}
        <NavLink to="/friends">
          {({ isActive }) => (
            <IconButton $active={isActive} title="Amigos">
              <User2 size={22} />
            </IconButton>
          )}
        </NavLink>

        {/* 3º Botão: /explorer (Explorar) */}
        <NavLink to="/explorer">
          {({ isActive }) => (
            <IconButton $active={isActive} title="Explorar">
              <Compass size={22} />
            </IconButton>
          )}
        </NavLink>

        {/* 4º Botão: /new-group (Novo Grupo) */}
        <NavLink to="/new-group">
          {({ isActive }) => (
            <IconButton $active={isActive} $dashed title="Novo Grupo">
              <Plus size={22} />
            </IconButton>
          )}
        </NavLink>
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
