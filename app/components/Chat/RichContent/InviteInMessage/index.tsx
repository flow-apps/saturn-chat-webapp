import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InviteData } from "~/types/interfaces";
import { useAuth } from "~/contexts/auth";
import api from "~/services/api";
import LoadingIndicator from "~/components/LoadingIndicator";
import { ParticipantStates } from "~/types/enums";

import {
  Container,
  InviteTitle,
  GroupContainer,
  GroupRightSideContainer,
  GroupLeftSideContainer,
  GroupAvatar,
  GroupName,
  GroupDescription,
  AcceptInviteButton,
} from "./styles";

interface ParticipantData {
  group_id: string;
  state: ParticipantStates;
  group: {
    name: string;
  };
}

interface InviteInMessageProps {
  inviteID: string;
}

const InviteInMessage: React.FC<InviteInMessageProps> = ({ inviteID }) => {
  const [loading, setLoading] = useState(false);
  const [invite, setInvite] = useState<null | InviteData>(null);
  const [participating, setParticipating] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/invites/${inviteID}?user_id=${user?.id}`);
        if (res.status === 200 && isMounted) {
          setInvite(res.data.invite);

          const participant = res.data?.participant as ParticipantData;

          if (!participant) {
            setParticipating(false);
          } else if (participant.state === ParticipantStates.JOINED) {
            setParticipating(true);
          }
        }
      } catch (error) {
        if (isMounted) setInvite(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [inviteID, user?.id]);

  const handleJoin = async () => {
    try {
      const res = await api.get(`/inv/join/${inviteID}`);
      if (res.status === 200) {
        const data = res.data as ParticipantData;

        // Dispara evento para o Google Analytics Web (caso configurado com window.gtag)
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "join_group", {
            method: "invite",
            group_id: data.group_id,
          });
        }

        toast.success(`Você entrou no grupo ${data.group.name}!`);
        setParticipating(true);
      }
    } catch (err) {
      toast.error("Erro ao tentar entrar no grupo pelo convite.");
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingIndicator />
      </Container>
    );
  }

  if (!invite) {
    return (
      <Container>
        <GroupRightSideContainer>
          <GroupName>Convite inválido ou expirado</GroupName>
          <GroupDescription>Este link de convite não é mais válido.</GroupDescription>
        </GroupRightSideContainer>
      </Container>
    );
  }

  return (
    <Container>
      <InviteTitle>CONVITE DE GRUPO</InviteTitle>
      <GroupContainer>
        <GroupRightSideContainer>
          <GroupAvatar
            src={invite?.group?.group_avatar?.url || "/group-placeholder.png"}
            alt={invite.group.name}
          />
        </GroupRightSideContainer>
        <GroupLeftSideContainer>
          <GroupName title={invite.group.name}>{invite.group.name}</GroupName>
          <GroupDescription>
            {invite.group.description || "Sem descrição disponível."}
          </GroupDescription>
        </GroupLeftSideContainer>
      </GroupContainer>

      <AcceptInviteButton
        onClick={handleJoin}
        disabled={participating}
        $participating={participating}
      >
        {participating ? "Já participante" : "Entrar no Grupo"}
      </AcceptInviteButton>
    </Container>
  );
};

export default memo(InviteInMessage, (prev, next) => {
  return prev.inviteID === next.inviteID;
});