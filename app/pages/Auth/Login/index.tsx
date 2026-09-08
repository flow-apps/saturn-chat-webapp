import React, { useState, FormEvent } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useAuth } from "~/contexts/auth";
import Header from "~/components/Header";
import Input from "~/components/Input";
import Button from "~/components/Button";
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
  ErrorContainer,
  ErrorText,
} from "./styles";

const Login: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, loading, loginError, internalError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pega a rota que o usuário tentou acessar previamente ou redireciona para a home "/"
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!emailOrUsername.trim() || !password) return;

    try {
      await signIn(emailOrUsername, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Erro ao realizar login:", error);
    }
  };

  const isButtonEnabled = !!emailOrUsername.trim() && !!password;

  return (
    <>
      <Header />
      <Container>
        <SideBySideContainer>
          <PresentationContainer>
            <PresentationTitle>Olá, seja bem-vindo de volta!</PresentationTitle>
            <PresentationSubtitle>
              Acesse sua conta para continuar conversando com seus amigos e
              acompanhar suas mensagens em tempo real.
            </PresentationSubtitle>
          </PresentationContainer>
          <LoginContainer>
            <LoginCard>
              <LoginCardTitle>Bem-vindo de volta!</LoginCardTitle>
              <LoginCardSubtitle>
                Insira suas credenciais para acessar novamente sua conta
              </LoginCardSubtitle>

              <LoginForm onSubmit={handleSubmit}>
                {/* TRATAMENTO DE ERROS */}
                {loginError && !internalError?.has && (
                  <ErrorContainer>
                    <ErrorText>
                      Credenciais inválidas. Verifique seu e-mail/usuário e
                      senha.
                    </ErrorText>
                  </ErrorContainer>
                )}
                {loginError && internalError?.has && (
                  <ErrorContainer>
                    <ErrorText>
                      Erro interno do servidor: {internalError.reason}
                    </ErrorText>
                  </ErrorContainer>
                )}

                <InputContainer>
                  <Input
                    label="E-mail ou nome de usuário"
                    type="text"
                    placeholder="Digite seu e-mail ou nome de usuário"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                  />
                </InputContainer>

                <InputContainer>
                  <Input
                    label="Senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputContainer>

                <Button
                  title="Entrar"
                  type="submit"
                  loading={loading}
                  disabled={!isButtonEnabled || loading}
                />

                <NewAccountContainer>
                  É novo por aqui?{" "}
                  <NavLink to={"/register"}>
                    Crie sua conta gratuitamente
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
