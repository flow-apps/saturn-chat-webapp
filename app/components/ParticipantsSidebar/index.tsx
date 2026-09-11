import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  X,
  Crown,
  ArrowLeft,
  User,
  UserPlus,
  UserX,
  Slash,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";

import api from "~/services/api";
import { ParticipantsData } from "~/types/interfaces";
import { ParticipantRoles } from "~/types/enums";
import { useAuth } from "~/contexts/auth";
import { usePremium } from "~/contexts/premium";
import Loading from "~/components/Loading";
import PremiumName from "~/components/PremiumName";
import ChangeRoleModal from "~/components/ChangeRoleModal";
import PunishParticipantModal from "~/components/PunishParticipantModal";

import {
  Overlay,
  SidebarContainer,
  SidebarHeader,
  HeaderTitleWrapper,
  Title,
  Subtitle,
  CloseButton,
  BackButton,
  ParticipantsListContainer,
  ParticipantCard,
  ParticipantAvatarContainer,
  ParticipantAvatar,
  ParticipantStatusDot,
  ParticipantInfos,
  JoinedDateText,
  OwnerBadge,
  ContentBody,
  ParticipantProfileHeader,
  OptionsContainer,
  OptionsTitle,
  OptionItem,
  OptionText,
} from "./styles";

moment.locale("pt-br");

interface ParticipantsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

const authorizedForPunish = [
  ParticipantRoles.ADMIN,
  ParticipantRoles.MODERATOR,
  ParticipantRoles.OWNER,
];

const authorizedForManageRoles = [
  ParticipantRoles.OWNER,
  ParticipantRoles.ADMIN,
  ParticipantRoles.MANAGER,
];

export const ParticipantsSidebar: React.FC<ParticipantsSidebarProps> = ({
  isOpen,
  onClose,
  groupId,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = usePremium();

  // Estados da Lista de Participantes
  const [participants, setParticipants] = useState<ParticipantsData[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadedAll, setLoadedAll] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Estados dos Modais e Participante Selecionado
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantsData | null>(null);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] =
    useState<boolean>(false);
  const [punishModalState, setPunishModalState] = useState<{
    isOpen: boolean;
    type: "kick" | "ban";
  }>({ isOpen: false, type: "kick" });

  const [myRole, setMyRole] = useState<ParticipantRoles | "">("");

  // Carga Inicial
  const fetchInitialData = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setPage(0);
    setLoadedAll(false);
    try {
      const [listRes, myPartRes] = await Promise.all([
        api.get(
          `/group/participants/list/?group_id=${groupId}&_page=0&_limit=30`,
        ),
        api.get(`/group/participant/${groupId}`),
      ]);

      if (listRes.status === 200) {
        setParticipants(listRes.data);
        if (listRes.data.length < 30) setLoadedAll(true);
      }

      if (myPartRes.status === 200) {
        const part = myPartRes.data.participant as ParticipantsData;
        setMyRole(part.role.toUpperCase() as ParticipantRoles);
      }
    } catch (error) {
      console.error("Erro ao carregar participantes:", error);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedParticipant(null);
    fetchInitialData();
  }, [isOpen, fetchInitialData]);

  // Scroll Infinito
  const fetchMoreParticipants = useCallback(async () => {
    if (fetching || loadedAll || selectedParticipant) return;

    setFetching(true);
    const nextPage = page + 1;

    try {
      const res = await api.get(
        `/group/participants/list/?group_id=${groupId}&_page=${nextPage}&_limit=30`,
      );

      if (!res.data || res.data.length === 0) {
        setLoadedAll(true);
      } else {
        setParticipants((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        if (res.data.length < 30) setLoadedAll(true);
      }
    } catch (error) {
      console.error("Erro ao carregar mais participantes:", error);
    } finally {
      setFetching(false);
    }
  }, [fetching, loadedAll, page, groupId, selectedParticipant]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      fetchMoreParticipants();
    }
  };

  const handleClose = () => {
    setSelectedParticipant(null);
    setIsChangeRoleModalOpen(false);
    setPunishModalState({ isOpen: false, type: "kick" });
    onClose();
  };

  // NAVEGAÇÃO / AÇÕES
  const handleGoUserProfile = (userId: string) => {
    navigate(`/user-profile/${userId}`);
    handleClose();
  };

  const handleOpenPunishModal = (type: "kick" | "ban") => {
    setPunishModalState({ isOpen: true, type });
  };

  const handleActionSuccess = () => {
    setSelectedParticipant(null);
    fetchInitialData();
  };

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={handleClose}>
        <SidebarContainer onClick={(e) => e.stopPropagation()}>
          {/* HEADER DA SIDEBAR */}
          <SidebarHeader>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {selectedParticipant && (
                <BackButton
                  onClick={() => setSelectedParticipant(null)}
                  title="Voltar à lista"
                >
                  <ArrowLeft size={18} />
                </BackButton>
              )}
              <HeaderTitleWrapper>
                <Title>
                  {selectedParticipant
                    ? "Opções do Membro"
                    : "Membros do Grupo"}
                </Title>
                <Subtitle>
                  {selectedParticipant
                    ? selectedParticipant.user?.name
                    : `${participants.length} participantes`}
                </Subtitle>
              </HeaderTitleWrapper>
            </div>

            <CloseButton onClick={handleClose} title="Fechar">
              <X size={20} />
            </CloseButton>
          </SidebarHeader>

          {/* CORPO DA SIDEBAR */}
          {loading ? (
            <Loading />
          ) : selectedParticipant ? (
            /* TELA DE DETALHES E AÇÕES DO PARTICIPANTE */
            <ContentBody>
              <ParticipantProfileHeader>
                <ParticipantAvatarContainer style={{ width: 72, height: 72 }}>
                  <ParticipantAvatar
                    src={
                      selectedParticipant.user?.avatar?.url ||
                      "/avatar-placeholder.jpg"
                    }
                    alt={selectedParticipant.user?.name || "Avatar"}
                    style={{ width: 72, height: 72 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/avatar-placeholder.jpg";
                    }}
                  />
                </ParticipantAvatarContainer>
                <PremiumName
                  name={selectedParticipant.user?.name || "Usuário"}
                  nameSize={16}
                  hasPremium={selectedParticipant.user?.isPremium}
                />
              </ParticipantProfileHeader>

              <OptionsContainer>
                <OptionsTitle>Ações do Participante</OptionsTitle>

                <OptionItem
                  onClick={() =>
                    handleGoUserProfile(selectedParticipant.user?.id)
                  }
                >
                  <User size={18} />
                  <OptionText>Ver Perfil</OptionText>
                </OptionItem>

                {authorizedForManageRoles.includes(
                  myRole as ParticipantRoles,
                ) &&
                  selectedParticipant.group?.type === "GROUP" &&
                  selectedParticipant.role !== ParticipantRoles.OWNER && (
                    <OptionItem
                      $primary
                      onClick={() => setIsChangeRoleModalOpen(true)}
                    >
                      <UserPlus size={18} />
                      <OptionText $primary>Alterar Cargo</OptionText>
                    </OptionItem>
                  )}

                {authorizedForPunish.includes(myRole as ParticipantRoles) &&
                  selectedParticipant.group?.type === "GROUP" &&
                  selectedParticipant.role !== ParticipantRoles.OWNER && (
                    <>
                      <OptionItem
                        $danger
                        onClick={() => handleOpenPunishModal("kick")}
                      >
                        <UserX size={18} />
                        <OptionText $danger>Expulsar do Grupo</OptionText>
                      </OptionItem>

                      <OptionItem
                        $danger
                        onClick={() => handleOpenPunishModal("ban")}
                      >
                        <Slash size={18} />
                        <OptionText $danger>Banir do Grupo</OptionText>
                      </OptionItem>
                    </>
                  )}
              </OptionsContainer>
            </ContentBody>
          ) : (
            /* LISTA DE PARTICIPANTES */
            <ParticipantsListContainer onScroll={handleScroll}>
              {participants.map((item) => {
                const isOwner = item.group?.owner?.id === item.user?.id;
                const isCurrentUser = item.user?.id === user?.id;
                const isOnline = isCurrentUser || item.status === "ONLINE";

                const dateText = isOwner
                  ? `Criou em ${moment(item.participating_since).format("DD/MM/YYYY")}`
                  : `Entrou em ${moment(item.participating_since).format("DD/MM/YYYY")}`;

                const lastSeenText = isOnline
                  ? "Online agora"
                  : item.last_seen
                    ? `Visto ${moment(item.last_seen).fromNow()}`
                    : null;

                return (
                  <ParticipantCard
                    key={item.id}
                    onClick={() => setSelectedParticipant(item)}
                  >
                    <ParticipantAvatarContainer>
                      <ParticipantAvatar
                        src={
                          item.user?.avatar?.url || "/avatar-placeholder.jpg"
                        }
                        alt={item.user?.name || "Avatar"}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/avatar-placeholder.jpg";
                        }}
                      />
                      <ParticipantStatusDot $isOnline={isOnline} />
                    </ParticipantAvatarContainer>

                    <ParticipantInfos>
                      <PremiumName
                        name={
                          item.user?.name || item.user?.nickname || "Membro"
                        }
                        nameSize={14}
                        hasPremium={
                          isCurrentUser ? isPremium : item.user?.isPremium
                        }
                      />
                      <JoinedDateText>{dateText}</JoinedDateText>
                      {lastSeenText && (
                        <JoinedDateText $highlight={isOnline}>
                          {lastSeenText}
                        </JoinedDateText>
                      )}
                    </ParticipantInfos>

                    {isOwner && (
                      <OwnerBadge title="Dono do grupo">
                        <Crown size={14} />
                        <span>Dono</span>
                      </OwnerBadge>
                    )}
                  </ParticipantCard>
                );
              })}

              {fetching && <Loading />}
            </ParticipantsListContainer>
          )}
        </SidebarContainer>
      </Overlay>

      {/* MODAL PARA ALTERAR CARGO */}
      <ChangeRoleModal
        isOpen={isChangeRoleModalOpen}
        onClose={() => setIsChangeRoleModalOpen(false)}
        participant={selectedParticipant}
        onSuccess={handleActionSuccess}
      />

      {/* MODAL PARA PUNIR (EXPULSAR / BANIR) */}
      <PunishParticipantModal
        isOpen={punishModalState.isOpen}
        onClose={() =>
          setPunishModalState((prev) => ({ ...prev, isOpen: false }))
        }
        type={punishModalState.type}
        participant={selectedParticipant}
        onSuccess={handleActionSuccess}
      />
    </>
  );
};

export default ParticipantsSidebar;
