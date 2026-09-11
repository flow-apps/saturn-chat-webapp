import React, { useState } from "react";
import {
  Shield,
  User,
  Zap,
  Command,
  Check,
  X,
  Save,
} from "lucide-react";
import api from "~/services/api";
import { ParticipantsData } from "~/types/interfaces";
import Loading from "~/components/Loading";

import {
  Overlay,
  ModalCard,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  Subtitle,
  FormContainer,
  SelectContainer,
  Label,
  Select,
  RoleInfoBox,
  RoleInfoTitle,
  RoleDescription,
  PermissionsGrid,
  PermissionItem,
  SubmitButton,
} from "./styles";

type Roles = "participant" | "mod" | "manager" | "admin";

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantsData | null;
  onSuccess?: () => void;
}

const ROLES_DEFINITIONS: Record<
  Roles,
  {
    name: string;
    description: string;
    permissions: {
      create_invites: boolean;
      punish_members: boolean;
      manage_roles: boolean;
      manage_messages: boolean;
      edit_group: boolean;
      delete_group: boolean;
    };
  }
> = {
  participant: {
    name: "Participante",
    description: "Membro comum do grupo. Pode enviar mensagens e interagir normalmente com o chat.",
    permissions: {
      create_invites: false,
      punish_members: false,
      manage_roles: false,
      manage_messages: false,
      edit_group: false,
      delete_group: false,
    },
  },
  mod: {
    name: "Moderador",
    description: "Ajuda a manter a ordem no chat. Pode apagar mensagens inadequadas e punir participantes.",
    permissions: {
      create_invites: false,
      punish_members: true,
      manage_roles: false,
      manage_messages: true,
      edit_group: false,
      delete_group: false,
    },
  },
  manager: {
    name: "Gerente",
    description: "Gerencia a estrutura do grupo. Pode criar convites, editar informações do grupo e alterar cargos de membros.",
    permissions: {
      create_invites: true,
      punish_members: false,
      manage_roles: true,
      manage_messages: false,
      edit_group: true,
      delete_group: false,
    },
  },
  admin: {
    name: "Administrador",
    description: "Possui controle total sobre o grupo, com exceção da exclusão definitiva feita pelo Dono.",
    permissions: {
      create_invites: true,
      punish_members: true,
      manage_roles: true,
      manage_messages: true,
      edit_group: true,
      delete_group: true,
    },
  },
};

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  onClose,
  participant,
  onSuccess,
}) => {
  const [role, setRole] = useState<Roles>(() => {
    const rawRole = participant?.role?.toLowerCase();
    if (rawRole === "moderator") return "mod";
    return (rawRole as Roles) || "participant";
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !participant) return null;

  const currentRoleInfo = ROLES_DEFINITIONS[role] || ROLES_DEFINITIONS.participant;
  const { permissions } = currentRoleInfo;

  const handleSetRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const targetRoleParam = role === "mod" ? "MODERATOR" : role.toUpperCase();
      const res = await api.post(
        `/group/participant/role/set/${participant.id}?role=${targetRoleParam}&group_id=${participant.group.id}`,
      );

      if (res.status === 200 || res.status === 204) {
        alert("Cargo alterado com sucesso!");
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao alterar cargo:", error);
      alert("Não foi possível alterar o cargo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Shield size={20} />
            Alterar Cargo do Membro
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Subtitle>
            Selecione o novo cargo para <strong>{participant.user?.name}</strong>. Cada cargo confere diferentes permissões de gerenciamento dentro do grupo.
          </Subtitle>

          {loading ? (
            <Loading />
          ) : (
            <FormContainer onSubmit={handleSetRole}>
              <SelectContainer>
                <Label htmlFor="role-select">Cargo desejado</Label>
                <Select
                  id="role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Roles)}
                >
                  <option value="participant">Participante</option>
                  <option value="mod">Moderador</option>
                  <option value="manager">Gerente</option>
                  <option value="admin">Administrador</option>
                </Select>
              </SelectContainer>

              <RoleInfoBox>
                <RoleInfoTitle>{currentRoleInfo.name}</RoleInfoTitle>
                <RoleDescription>{currentRoleInfo.description}</RoleDescription>

                <PermissionsGrid>
                  <PermissionItem $active={permissions.create_invites}>
                    {permissions.create_invites ? <Check size={16} /> : <X size={16} />}
                    Criar convites
                  </PermissionItem>

                  <PermissionItem $active={permissions.punish_members}>
                    {permissions.punish_members ? <Check size={16} /> : <X size={16} />}
                    Punir membros (expulsar/banir)
                  </PermissionItem>

                  <PermissionItem $active={permissions.manage_roles}>
                    {permissions.manage_roles ? <Check size={16} /> : <X size={16} />}
                    Gerenciar cargos
                  </PermissionItem>

                  <PermissionItem $active={permissions.manage_messages}>
                    {permissions.manage_messages ? <Check size={16} /> : <X size={16} />}
                    Gerenciar mensagens
                  </PermissionItem>

                  <PermissionItem $active={permissions.edit_group}>
                    {permissions.edit_group ? <Check size={16} /> : <X size={16} />}
                    Editar dados do grupo
                  </PermissionItem>

                  <PermissionItem $active={permissions.delete_group}>
                    {permissions.delete_group ? <Check size={16} /> : <X size={16} />}
                    Excluir grupo
                  </PermissionItem>
                </PermissionsGrid>
              </RoleInfoBox>

              <SubmitButton type="submit" disabled={loading}>
                <Save size={18} />
                Salvar Cargo
              </SubmitButton>
            </FormContainer>
          )}
        </ModalBody>
      </ModalCard>
    </Overlay>
  );
};

export default ChangeRoleModal;