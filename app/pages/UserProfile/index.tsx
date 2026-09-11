import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Edit3,
  AlertOctagon,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  X,
} from "lucide-react";

import api from "~/services/api";
import { useAuth } from "~/contexts/auth";
import { usePremium } from "~/contexts/premium";
import { FriendData, UserData } from "~/types/interfaces";
import { FriendsStates, ParticipantStates, ReportToType } from "~/types/enums";
import Loading from "~/components/Loading";
import PremiumName from "~/components/PremiumName";
import ReportModal from "~/components/ReportModal";

import {
  Container,
  ProfileCard,
  Banner,
  HeaderActions,
  HeaderLeftActions,
  IconButton,
  AvatarWrapper,
  AvatarImage,
  BasicInfos,
  NicknameText,
  BioContainer,
  BioContent,
  StatsRow,
  StatItem,
  StatNumber,
  StatLabel,
  ActionsRow,
  ActionButton,
  SectionContainer,
  SectionTitle,
  GroupsGrid,
  GroupCard,
  GroupAvatar,
  GroupName,
  ImageModalOverlay,
  FullImageContainer,
} from "./styles";

export const UserProfile: React.FC = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = usePremium();

  const [loading, setLoading] = useState(true);
  const [userInfos, setUserInfos] = useState<UserData>({} as UserData);
  const [friendInfos, setFriendInfos] = useState<FriendData>();
  const [friendsState, setFriendsState] = useState<FriendsStates>();
  const [participatingGroups, setParticipatingGroups] = useState<any[]>([]);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const targetId = paramId || user?.id;
  const isSelf = userInfos.id === user?.id;

  // Função para voltar à página anterior com fallback para o chat/home
  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const fetchUserData = useCallback(async () => {
    if (!targetId) return;
    setLoading(true);

    try {
      const res = await api.get(`/users?user_id=${targetId}`);
      if (res.status === 200) {
        setUserInfos(res.data);
        if (res.data.friend) {
          setFriendInfos(res.data.friend);
          setFriendsState(res.data.friend.state);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (!userInfos?.participating?.length) {
      setParticipatingGroups([]);
      return;
    }

    const filtered = userInfos.participating.filter(
      (p) =>
        p.group?.privacy !== "PRIVATE" && p.state === ParticipantStates.JOINED,
    );
    setParticipatingGroups(filtered);
  }, [userInfos]);

  const handleRequestFriend = async () => {
    try {
      const res = await api.post(`/friends/request?friend_id=${userInfos.id}`);
      if (res.status === 200) {
        setFriendsState(res.data.state);
      }
    } catch (error) {
      console.error("Erro ao solicitar amizade:", error);
    }
  };

  const handleAcceptOrRejectFriend = async (action: "ACCEPT" | "REJECT") => {
    if (!friendInfos?.id) return;
    try {
      const res = await api.put(
        `/friends/response?state=${action}&friend_id=${friendInfos.id}`,
      );
      if (res.status === 200) {
        setFriendsState(res.data.state);
      }
    } catch (error) {
      console.error("Erro ao responder solicitação de amizade:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container>
      {/* MODAL DE DENÚNCIA */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        type={ReportToType.USER}
        targetId={{ userId: userInfos.id }}
      />

      {/* MODAL PREVIEW DE FOTO */}
      {isImagePreviewOpen && userInfos.avatar?.url && (
        <ImageModalOverlay onClick={() => setIsImagePreviewOpen(false)}>
          <FullImageContainer onClick={(e) => e.stopPropagation()}>
            <img src={userInfos.avatar.url} alt={userInfos.name} />
            <IconButton
              onClick={() => setIsImagePreviewOpen(false)}
              style={{ position: "absolute", top: 16, right: 16 }}
            >
              <X size={20} />
            </IconButton>
          </FullImageContainer>
        </ImageModalOverlay>
      )}

      <ProfileCard>
        {/* BANNER E AÇÕES DO CABEÇALHO */}
        <Banner>
          <HeaderLeftActions>
            <IconButton title="Voltar" onClick={handleGoBack}>
              <ArrowLeft size={18} />
            </IconButton>
          </HeaderLeftActions>

          <HeaderActions>
            {isSelf ? (
              <IconButton
                title="Editar Perfil"
                onClick={() => navigate("/edit-profile")}
              >
                <Edit3 size={18} />
              </IconButton>
            ) : (
              <IconButton
                title="Denunciar Usuário"
                onClick={() => setIsReportModalOpen(true)}
              >
                <AlertOctagon size={18} />
              </IconButton>
            )}
          </HeaderActions>
        </Banner>

        {/* FOTO E IDENTIFICAÇÃO */}
        <AvatarWrapper onClick={() => setIsImagePreviewOpen(true)}>
          <AvatarImage
            src={userInfos.avatar?.url || "/avatar-placeholder.jpg"}
            alt={userInfos.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/avatar-placeholder.jpg";
            }}
          />
        </AvatarWrapper>

        <BasicInfos>
          <PremiumName
            name={userInfos.name}
            nameSize={22}
            align="center"
            hasPremium={isSelf ? isPremium : userInfos.isPremium}
          />
          {userInfos.nickname && (
            <NicknameText>@{userInfos.nickname}</NicknameText>
          )}
        </BasicInfos>

        {/* BIO */}
        {userInfos.bio && (
          <BioContainer>
            <BioContent>{userInfos.bio}</BioContent>
          </BioContainer>
        )}

        {/* ESTATÍSTICAS (AMIGOS) */}
        {isSelf && (
          <StatsRow>
            <StatItem onClick={() => navigate("/friends-manager")}>
              <StatNumber>{userInfos.friendsAmount || 0}</StatNumber>
              <StatLabel>Amigos</StatLabel>
            </StatItem>
          </StatsRow>
        )}

        {/* BOTÃO DE ADICIONAR AMIGO */}
        {!isSelf && (
          <ActionsRow>
            {friendsState === FriendsStates.FRIENDS ? (
              <ActionButton disabled $variant="secondary">
                <UserCheck size={18} /> Amigos
              </ActionButton>
            ) : friendsState === FriendsStates.REQUESTED &&
              friendInfos?.received_by.id === user?.id ? (
              <div style={{ display: "flex", gap: 10 }}>
                <ActionButton
                  onClick={() => handleAcceptOrRejectFriend("ACCEPT")}
                >
                  <UserPlus size={18} /> Aceitar Amizade
                </ActionButton>
                <ActionButton
                  $variant="danger"
                  onClick={() => handleAcceptOrRejectFriend("REJECT")}
                >
                  <UserX size={18} /> Recusar
                </ActionButton>
              </div>
            ) : friendsState === FriendsStates.REQUESTED ? (
              <ActionButton disabled $variant="secondary">
                Solicitação Enviada
              </ActionButton>
            ) : (
              <ActionButton onClick={handleRequestFriend}>
                <UserPlus size={18} /> Adicionar aos Amigos
              </ActionButton>
            )}
          </ActionsRow>
        )}

        {/* GRUPOS PARTICIPANDO */}
        {!!participatingGroups.length && (
          <SectionContainer>
            <SectionTitle>
              <Users size={18} /> Grupos Participando
            </SectionTitle>
            <GroupsGrid>
              {participatingGroups.map((item) => (
                <GroupCard
                  key={item.id}
                  onClick={() => navigate(`/group-info/${item.group.id}`)}
                >
                  <GroupAvatar
                    src={
                      item.group.group_avatar?.url || "/avatar-placeholder.jpg"
                    }
                    alt={item.group.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/avatar-placeholder.jpg";
                    }}
                  />
                  <GroupName>{item.group.name}</GroupName>
                </GroupCard>
              ))}
            </GroupsGrid>
          </SectionContainer>
        )}
      </ProfileCard>
    </Container>
  );
};

export default UserProfile;
