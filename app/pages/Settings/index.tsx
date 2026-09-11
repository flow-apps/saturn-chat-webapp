import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Star,
  UserCheck,
  Globe,
  Moon,
  Sun,
  Bell,
  BellOff,
  Lock,
  Shield,
  Clock,
  FileText,
  Info,
  MessageSquare,
  Code,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "~/contexts/auth";
import { useThemeController } from "~/contexts/theme";
import { usePremium } from "~/contexts/premium";
import { useNotifications } from "~/contexts/notifications";
import { usePersistedState } from "~/hooks/usePersistedState";
import config from "~/config";

import {
  Container,
  ContentContainer,
  PageHeader,
  PageTitle,
  SectionsWrapper,
  SectionGroup,
  SectionTitle,
  ConfigsList,
  ConfigItem,
  ConfigTitle,
  CurrentValue,
  Switch,
  Select,
  SignOutButton,
  VersionFooter,
} from "./styles";
import Sidebar from "~/components/Sidebar";

const API_PREFERENCE_KEY = "@SaturnChat:useDevApi";
const BIOMETRICS_INTERVAL_KEY = "@SaturnChat:biometricsInterval";
const BIOMETRICS_INTERVALS = [0, 5, 15, 30, 60];

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toggleTheme, currentThemeName } = useThemeController();
  const { isPremium } = usePremium();
  const { enabled, toggleEnabledNotifications } = useNotifications();

  const [useDevApi, setUseDevApi] = usePersistedState<boolean>(
    API_PREFERENCE_KEY,
    false,
  );
  const [useBiometrics, setUseBiometrics] = usePersistedState<boolean>(
    "@SaturnChat:biometrics",
    false,
  );
  const [biometricsInterval, setBiometricsInterval] = usePersistedState<number>(
    BIOMETRICS_INTERVAL_KEY,
    0,
  );

  const showManageSub = useMemo(() => isPremium, [isPremium]);

  const appVersion = "1.0.0";
  const isDev = import.meta.env.DEV;

  const handleSignOut = useCallback(() => {
    if (window.confirm("Deseja realmente sair da sua conta?")) {
      signOut();
    }
  }, [signOut]);

  const handleOpenExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Container>
      <Sidebar />

      <ContentContainer>
        <PageHeader>
          <PageTitle>Configurações</PageTitle>
        </PageHeader>

        <SectionsWrapper>
          {/* GERAL */}
          <SectionGroup>
            <SectionTitle>Geral</SectionTitle>
            <ConfigsList>
              <ConfigItem
                onClick={() =>
                  navigate(
                    showManageSub ? "/manage-premium" : "/purchase-premium",
                  )
                }
              >
                <ConfigTitle $highlight>
                  <Star size={18} />
                  {showManageSub ? "Gerenciar Assinatura" : "Seja uma Star"}
                </ConfigTitle>
                <ChevronRight size={18} />
              </ConfigItem>

              <ConfigItem onClick={() => navigate("/edit-profile")}>
                <ConfigTitle>
                  <UserCheck size={18} />
                  Editar Perfil
                </ConfigTitle>
                <ChevronRight size={18} />
              </ConfigItem>

              <ConfigItem onClick={() => navigate("/switch-language")}>
                <ConfigTitle>
                  <Globe size={18} />
                  Idioma
                </ConfigTitle>
                <CurrentValue>Português (BR)</CurrentValue>
              </ConfigItem>

              <ConfigItem as="div">
                <ConfigTitle>
                  {currentThemeName === "dark" ? (
                    <Moon size={18} />
                  ) : (
                    <Sun size={18} />
                  )}
                  Tema Escuro
                </ConfigTitle>
                <Switch
                  type="checkbox"
                  checked={currentThemeName === "dark"}
                  onChange={toggleTheme}
                />
              </ConfigItem>

              <ConfigItem as="div">
                <ConfigTitle>
                  {enabled ? <Bell size={18} /> : <BellOff size={18} />}
                  Notificações
                </ConfigTitle>
                <Switch
                  type="checkbox"
                  checked={enabled}
                  onChange={toggleEnabledNotifications}
                />
              </ConfigItem>
            </ConfigsList>
          </SectionGroup>

          {/* CONTA E SEGURANÇA */}
          <SectionGroup>
            <SectionTitle>Conta</SectionTitle>
            <ConfigsList>
              <ConfigItem onClick={() => navigate("/switch-password")}>
                <ConfigTitle>
                  <Lock size={18} />
                  Alterar Senha
                </ConfigTitle>
                <ChevronRight size={18} />
              </ConfigItem>

              <ConfigItem as="div">
                <ConfigTitle>
                  <Shield size={18} />
                  Bloqueio de Sessão
                </ConfigTitle>
                <Switch
                  type="checkbox"
                  checked={useBiometrics}
                  onChange={(e) => setUseBiometrics(e.target.checked)}
                />
              </ConfigItem>

              {useBiometrics && (
                <ConfigItem as="div">
                  <ConfigTitle>
                    <Clock size={18} />
                    Tempo para Bloqueio
                  </ConfigTitle>
                  <Select
                    value={biometricsInterval}
                    onChange={(e) =>
                      setBiometricsInterval(Number(e.target.value))
                    }
                  >
                    {BIOMETRICS_INTERVALS.map((min) => (
                      <option key={min} value={min}>
                        {min === 0 ? "Imediatamente" : `${min} minutos`}
                      </option>
                    ))}
                  </Select>
                </ConfigItem>
              )}
            </ConfigsList>
          </SectionGroup>

          {/* SOBRE */}
          <SectionGroup>
            <SectionTitle>Sobre</SectionTitle>
            <ConfigsList>
              <ConfigItem
                onClick={() =>
                  handleOpenExternal(`${config.WEBSITE_URL}/privacy`)
                }
              >
                <ConfigTitle>
                  <FileText size={18} />
                  Política de Privacidade
                </ConfigTitle>
                <ChevronRight size={18} />
              </ConfigItem>

              <ConfigItem
                onClick={() =>
                  handleOpenExternal(`${config.WEBSITE_URL}/guidelines`)
                }
              >
                <ConfigTitle>
                  <Info size={18} />
                  Diretrizes da Comunidade
                </ConfigTitle>
                <ChevronRight size={18} />
              </ConfigItem>

              <ConfigItem onClick={() => navigate("/send-feedback")}>
                <ConfigTitle>
                  <MessageSquare size={18} />
                  Enviar Feedback
                </ConfigTitle>
                <ChevronRight size={18} />
              </ConfigItem>
            </ConfigsList>
          </SectionGroup>

          {/* OPÇÕES DE DESENVOLVEDOR */}
          {isDev && (
            <SectionGroup>
              <SectionTitle>Desenvolvedor</SectionTitle>
              <ConfigsList>
                <ConfigItem as="div">
                  <ConfigTitle>
                    <Code size={18} />
                    Usar API de Dev
                  </ConfigTitle>
                  <Switch
                    type="checkbox"
                    checked={useDevApi}
                    onChange={(e) => setUseDevApi(e.target.checked)}
                  />
                </ConfigItem>
              </ConfigsList>
            </SectionGroup>
          )}

          {/* SAIR */}
          <SignOutButton onClick={handleSignOut}>
            <LogOut size={18} />
            Sair da Conta
          </SignOutButton>

          <VersionFooter>
            Saturn Chat v{appVersion} {isDev && "(Web Development)"}
          </VersionFooter>
        </SectionsWrapper>
      </ContentContainer>
    </Container>
  );
};

export default Settings;
