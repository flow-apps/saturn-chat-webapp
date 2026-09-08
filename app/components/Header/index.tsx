import React from "react";
import { AppName, Container, Logo, LogoContainer } from "./styles";

const Header: React.FC = () => {
  return (
    <Container>
      <LogoContainer to={"/"}>
        <Logo src="/logo_alpha.png" />
        <AppName>Saturn Chat</AppName>
      </LogoContainer>
    </Container>
  );
};

export default Header;
