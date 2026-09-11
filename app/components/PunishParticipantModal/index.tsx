import React, { useState } from "react";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";
import api from "~/services/api";
import { ParticipantsData } from "~/types/interfaces";
import { useWebsocket } from "~/contexts/websocket";
import Loading from "~/components/Loading";

import {
  Overlay,
  ModalCard,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  IconWrapper,
  Description,
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  ButtonsGroup,
  ConfirmButton,
  CancelButton,
} from "./styles";

interface PunishParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "kick" | "ban";
  participant: ParticipantsData | null;
  onSuccess?: () => void;
}

export const PunishParticipantModal: React.FC<PunishParticipantModalProps> = ({
  isOpen,
  onClose,
  type,
  participant,
  onSuccess,
}) => {
  const { socket } = useWebsocket();
  const [notify, setNotify] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen || !participant) return null;

  const isKick = type === "kick";
  const userName =
    participant.user?.name || participant.user?.nickname || "o usuário";
  const groupName = participant.group?.name || "o grupo";
  const userId = participant.user?.id || (participant as any).user_id;

  const handlePunish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.get(
        `/group/participant/${type}/${participant.id}?group_id=${participant.group.id}`,
      );

      if (res.status === 200 || res.status === 204) {
        // Emitir evento Socket para notificar a sala
        if (socket) {
          socket.emit(`${isKick ? "kicked" : "banned"}_user_register`, {
            group_id: participant.group.id,
            user_id: userId,
            notify,
          });
        }

        alert(
          isKick
            ? `${userName} foi expulsou do grupo com sucesso.`
            : `${userName} foi banido do grupo com sucesso.`,
        );

        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao aplicar punição:", error);
      alert("Não foi possível concluir a ação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <ShieldAlert size={20} />
            {isKick ? "Expulsar Participante" : "Banir Participante"}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <IconWrapper>
            <AlertTriangle size={54} />
          </IconWrapper>

          <Description>
            {isKick
              ? `Tem certeza que deseja expulsar ${userName} de "${groupName}"? O usuário poderá retornar ao grupo se receber um novo convite.`
              : `Tem certeza que deseja banir ${userName} de "${groupName}"? O usuário será removido e não poderá entrar novamente por links de convite.`}
          </Description>

          <CheckboxContainer>
            <CheckboxInput
              type="checkbox"
              id="notify-user-check"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
            />
            <CheckboxLabel htmlFor="notify-user-check">
              Notificar o usuário sobre esta ação
            </CheckboxLabel>
          </CheckboxContainer>

          {loading ? (
            <Loading />
          ) : (
            <ButtonsGroup>
              <ConfirmButton
                type="button"
                onClick={handlePunish}
                disabled={loading}
              >
                {isKick ? "Confirmar Expulsão" : "Confirmar Banimento"}
              </ConfirmButton>
              <CancelButton type="button" onClick={onClose} disabled={loading}>
                Cancelar
              </CancelButton>
            </ButtonsGroup>
          )}
        </ModalBody>
      </ModalCard>
    </Overlay>
  );
};

export default PunishParticipantModal;
