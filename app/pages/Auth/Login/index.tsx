import React from "react";
import {
  Container,
  InputContainer,
  LoginCard,
  LoginCardSubtitle,
  LoginCardTitle,
  LoginContainer,
  LoginForm,
  NewAccountContainer,
  PresentationContainer,
  PresentationSubtitle,
  PresentationTitle,
  SideBySideContainer,
} from "./styles";
import Header from "~/components/Header";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { NavLink } from "react-router";

const Login: React.FC = () => {
  return (
    <>
      <Header />
      <Container>
        <SideBySideContainer>
          <PresentationContainer>
            <PresentationTitle>Olá, seja bem-vindo de volta!</PresentationTitle>
            <PresentationSubtitle>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
              ipsum explicabo exercitationem, modi fuga, tempore, sequi
              asperiores cupiditate hic mollitia eligendi sed doloribus cum sint
              eius ut suscipit beatae impedit!
            </PresentationSubtitle>
          </PresentationContainer>
          <LoginContainer>
            <LoginCard>
              <LoginCardTitle>Bem-vindo de volta!</LoginCardTitle>
              <LoginCardSubtitle>
                Insira sua credenciais para acessar novamente sua conta
              </LoginCardSubtitle>
              <LoginForm>
                <InputContainer>
                  <Input label="E-mail ou nome de usuário" type="email" />
                </InputContainer>
                <InputContainer>
                  <Input label="Senha" type="password" />
                </InputContainer>
                <Button title="Entrar" />
                <NewAccountContainer>
                  É novo por aqui?{" "}
                  <NavLink to={"/register"}>
                    {"  "}Crie sua conta gratuitamente
                  </NavLink>
                </NewAccountContainer>
              </LoginForm>
            </LoginCard>
          </LoginContainer>
        </SideBySideContainer>
      </Container>
    </>
  );
};

export default Login;
