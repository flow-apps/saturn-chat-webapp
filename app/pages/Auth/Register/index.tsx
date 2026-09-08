import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { NavLink } from "react-router";
import { Camera } from "lucide-react";
import { useTheme } from "styled-components";
import { useAuth } from "~/contexts/auth";
import Header from "~/components/Header";
import Input from "~/components/Input";
import Button from "~/components/Button";
import api from "~/services/api";
import config from "~/config";

// --- EXPRESSÕES REGULARES ---
export const passwordValidation =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const nicknameValidation = /^[a-zA-Z0-9_-]+$/;

import {
  AlreadyHaveAccountContainer,
  Avatar,
  ConsentText,
  Container,
  ErrorContainer,
  ErrorText,
  FieldError,
  FieldInfo,
  FieldInfoContainer,
  InputContainer,
  PresentationContainer,
  PresentationSubtitle,
  PresentationTitle,
  RegisterCard,
  RegisterCardSubtitle,
  RegisterCardTitle,
  RegisterContainer,
  RegisterForm,
  SearchText,
  SelectAvatarButton,
  SelectAvatarContainer,
  SelectAvatarSubtitle,
  SelectAvatarTitle,
  SideBySideContainer,
} from "./styles";

const Register: React.FC = () => {
  // --- STATES DE FORMULÁRIO ---
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  // --- STATES DE ERRO ---
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [passConfirmError, setPassConfirmError] = useState(false);

  // --- STATES DE NICKNAME ASSÍNCRONO ---
  const [nicknameTimeout, setNicknameTimeout] = useState<NodeJS.Timeout>();
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");
  const [nicknameError, setNicknameError] = useState(false);
  const [fetchingNickname, setFetchingNickname] = useState(false);

  const { colors } = useTheme();
  const { signUp, loading, registerError, internalError } = useAuth();

  const nicknameErrors = {
    400: "O nome de usuário aceita apenas letras, números, '-' e '_'",
    404: "O nome de usuário não foi fornecido",
    1000: "Não foi possível buscar o nome de usuário",
    unavailable: "O nome de usuário não está disponível",
  };

  // --- VERIFICAÇÃO DE NICKNAME NA API ---
  const checkNickname = async (nick: string) => {
    if (fetchingNickname) return;

    if (!nick.trim().length) {
      setNicknameError(false);
      setNicknameErrorMessage("");
      return;
    }

    setFetchingNickname(true);

    await api
      .get(`/users/nickname/check/${nick}`)
      .then((res) => {
        const { is_available } = res.data;

        if (is_available) {
          setNicknameError(false);
          setNicknameErrorMessage("");
        } else {
          setNicknameError(true);
          setNicknameErrorMessage(nicknameErrors.unavailable);
        }
      })
      .catch((error) => {
        const status: number = error?.response?.status;

        if (status === 404) {
          setNicknameError(false);
          setNicknameErrorMessage("");
          return;
        }

        setNicknameError(true);
        setNicknameErrorMessage(
          nicknameErrors[status as keyof typeof nicknameErrors] ||
            nicknameErrors[1000],
        );
      })
      .finally(() => setFetchingNickname(false));
  };

  // --- HANDLERS COM VALIDAÇÃO REGEX ---
  const handleSetEmail = (value: string) => {
    setEmail(value);
    if (value.length > 0 && !emailValidation.test(value)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleSetNickname = (value: string) => {
    setNickname(value);

    if (!value.length) {
      setNicknameError(false);
      setNicknameErrorMessage("");
      return;
    }

    if (!nicknameValidation.test(value)) {
      setNicknameError(true);
      setNicknameErrorMessage(nicknameErrors[400]);
      if (nicknameTimeout) {
        clearTimeout(nicknameTimeout);
        setNicknameTimeout(undefined);
      }
    } else {
      setNicknameError(false);
      setNicknameErrorMessage("");
    }
  };

  const handleSetPassword = (value: string) => {
    setPassword(value);

    if (value.length > 0 && !passwordValidation.test(value)) {
      setPassError(true);
    } else {
      setPassError(false);
    }

    if (passwordConfirm.length > 0 && passwordConfirm !== value) {
      setPassConfirmError(true);
    } else {
      setPassConfirmError(false);
    }
  };

  const handleSetPassConfirm = (value: string) => {
    setPasswordConfirm(value);

    if (value.length > 0 && password !== value) {
      setPassConfirmError(true);
    } else {
      setPassConfirmError(false);
    }
  };

  // --- EFFECT DE DEBOUNCE PARA CHECK DO NICKNAME ---
  useEffect(() => {
    const NICKNAME_TIMEOUT = 500;

    if (nicknameError || !nickname.length) {
      if (nicknameTimeout) {
        clearTimeout(nicknameTimeout);
        setNicknameTimeout(undefined);
      }
      return;
    }

    if (nicknameTimeout) {
      clearTimeout(nicknameTimeout);
    }

    const newTimeout = setTimeout(async () => {
      await checkNickname(nickname);
      setNicknameTimeout(undefined);
    }, NICKNAME_TIMEOUT);

    setNicknameTimeout(newTimeout);

    return () => {
      if (nicknameTimeout) clearTimeout(nicknameTimeout);
    };
  }, [nickname]);

  // --- SELEÇÃO DE AVATAR (COM LIMITE DE 5 MB) ---
  const handleSelectAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB em bytes

      if (file.size > MAX_FILE_SIZE) {
        setAvatarError("A foto selecionada deve ter no máximo 5 MB.");
        setAvatar(null);
        setAvatarPreview(null);
        e.target.value = "";
        return;
      }

      setAvatarError(null);
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isButtonEnabled) return;

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("nickname", nickname);
    data.append("password", password);

    if (avatar) {
      data.append("avatar", avatar);
    }

    await signUp(data, email);
  };

  const isButtonEnabled =
    !!name.trim() &&
    !!email.trim() &&
    !emailError &&
    !!nickname.trim() &&
    !nicknameError &&
    !fetchingNickname &&
    !!password &&
    !passError &&
    !!passwordConfirm &&
    !passConfirmError &&
    !avatarError;

  return (
    <>
      <Header />
      <Container>
        <SideBySideContainer>
          <PresentationContainer>
            <PresentationTitle>Crie sua conta agora!</PresentationTitle>
            <PresentationSubtitle>
              Junte-se à nossa plataforma e comece a se conectar com seus amigos
              de forma simples, rápida e segura.
            </PresentationSubtitle>
          </PresentationContainer>

          <RegisterContainer>
            <RegisterCard>
              <RegisterCardTitle>Crie sua conta</RegisterCardTitle>
              <RegisterCardSubtitle>
                Preencha os campos abaixo para realizar seu cadastro
              </RegisterCardSubtitle>

              <RegisterForm onSubmit={handleSubmit}>
                {/* SELETOR DE AVATAR */}
                <SelectAvatarContainer>
                  <SelectAvatarButton type="button">
                    <label htmlFor="avatar-upload">
                      {avatarPreview ? (
                        <Avatar src={avatarPreview} alt="Preview Avatar" />
                      ) : (
                        <Camera
                          size={55}
                          color={colors?.secondary || "#00b4d8"}
                        />
                      )}
                    </label>
                  </SelectAvatarButton>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleSelectAvatar}
                    style={{ display: "none" }}
                  />
                  <SelectAvatarTitle>Foto de Perfil</SelectAvatarTitle>
                  <SelectAvatarSubtitle>
                    {!avatar
                      ? "Clique para selecionar uma foto (máx. 5 MB)"
                      : "Foto selecionada"}
                  </SelectAvatarSubtitle>
                  {avatarError && <FieldError>{avatarError}</FieldError>}
                </SelectAvatarContainer>

                {/* ERROS GLOBAIS DE CONTEXTO */}
                {registerError && !internalError?.has && (
                  <ErrorContainer>
                    <ErrorText>
                      Ocorreu um erro ao cadastrar sua conta. Verifique os
                      dados.
                    </ErrorText>
                  </ErrorContainer>
                )}
                {registerError && internalError?.has && (
                  <ErrorContainer>
                    <ErrorText>Erro interno: {internalError.reason}</ErrorText>
                  </ErrorContainer>
                )}

                {/* NOME COMPLETO */}
                <InputContainer>
                  <Input
                    label="Nome completo"
                    placeholder="Ex.: Pedro Henrique"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                </InputContainer>

                {/* E-MAIL */}
                <InputContainer>
                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="Ex.: usuario@exemplo.com"
                    onChange={(e) => handleSetEmail(e.target.value)}
                    value={email}
                    required
                  />
                  {emailError && (
                    <FieldError>Por favor, insira um e-mail válido</FieldError>
                  )}
                </InputContainer>

                {/* NOME DE USUÁRIO */}
                <InputContainer>
                  <Input
                    label="Nome de usuário"
                    placeholder="pedro_henrique"
                    onChange={(e) => handleSetNickname(e.target.value)}
                    value={nickname}
                    required
                  />
                  {fetchingNickname && (
                    <SearchText>Verificando disponibilidade...</SearchText>
                  )}
                  {nicknameError && (
                    <FieldError>{nicknameErrorMessage}</FieldError>
                  )}
                  <FieldInfoContainer>
                    <FieldInfo>
                      Apenas letras, números, hífen (-) e underline (_).
                    </FieldInfo>
                  </FieldInfoContainer>
                </InputContainer>

                {/* SENHA */}
                <InputContainer>
                  <Input
                    label="Senha"
                    type="password"
                    onChange={(e) => handleSetPassword(e.target.value)}
                    value={password}
                    required
                  />
                  {passError && (
                    <FieldError>
                      A senha deve conter no mínimo 8 caracteres, incluindo uma
                      letra maiúscula, uma minúscula, um número e um símbolo
                      (#?!@$%^&*-).
                    </FieldError>
                  )}
                  <FieldInfoContainer>
                    <FieldInfo>
                      Mínimo de 8 caracteres com maiúscula, minúscula, número e
                      símbolo.
                    </FieldInfo>
                  </FieldInfoContainer>
                </InputContainer>

                {/* CONFIRMAR SENHA */}
                <InputContainer>
                  <Input
                    label="Confirme sua senha"
                    type="password"
                    onChange={(e) => handleSetPassConfirm(e.target.value)}
                    value={passwordConfirm}
                    required
                  />
                  {passConfirmError && (
                    <FieldError>As senhas não coincidem</FieldError>
                  )}
                </InputContainer>

                <Button
                  title="Cadastrar"
                  type="submit"
                  disabled={!isButtonEnabled || loading}
                  loading={loading}
                />

                <ConsentText>
                  Ao se cadastrar, você concorda com nossos{" "}
                  <a
                    href={`${config.WEBSITE_URL}/privacy`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Termos de Privacidade
                  </a>{" "}
                  e{" "}
                  <a
                    href={`${config.WEBSITE_URL}/guidelines`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Diretrizes da Comunidade
                  </a>
                  .
                </ConsentText>

                <AlreadyHaveAccountContainer>
                  Já possui uma conta?{" "}
                  <NavLink to={"/login"}>Faça login</NavLink>
                </AlreadyHaveAccountContainer>
              </RegisterForm>
            </RegisterCard>
          </RegisterContainer>
        </SideBySideContainer>
      </Container>
    </>
  );
};

export default Register;
