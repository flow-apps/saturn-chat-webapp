import React from "react";
import { Container } from "./styles";
import Header from "~/components/Header";

const Login: React.FC = () => {
  return (
    <Container>
      <Header />
      <h1>Essa é a página de login</h1>
    </Container>
  );
};

export default Login;
