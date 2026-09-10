import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Users,
  UserPlus,
  Edit3,
  FileText,
  Shield,
  Trash2,
  LogOut,
  X,
  Save,
  Info,
} from "lucide-react";
import api from "~/services/api";
import Loading from "~/components/Loading";
import { GroupData, ISetting, ParticipantsData } from "~/types/interfaces";
import { ParticipantRoles } from "~/types/enums";
import {
  rolesForDeleteGroup,
  rolesForEditGroup,
  rolesForEditConfigs,
  rolesForInvite,
} from "~/utils/authorizedRoles";

import {
  Overlay,
  ModalCard,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  SectionTitle,
  OptionsGroup,
  OptionItem,
  OptionText,
  OptionAction,
  Select,
  Switch,
  SaveFAB,
} from "./styles";

const uniqueSettings = (settings?: ISetting[]) =>
  settings?.filter(
    (setting, index, allSettings) =>
      allSettings.findIndex(
        (item) => item.setting_name === setting.setting_name,
      ) === index,
  );

const isSettingEnabled = (setting?: ISetting) =>
  String(setting?.setting_value) === "true";

interface GroupConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

export const GroupConfigModal: React.FC<GroupConfigModalProps> = ({
  isOpen,
  onClose,
  groupId,
}) => {
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupData>({} as GroupData);
  const [participant, setParticipant] = useState<ParticipantsData>(
    {} as ParticipantsData,
  );
  const [groupSettings, setGroupSettings] = useState<ISetting[]>();
  const [participantSettings, setParticipantSettings] = useState<ISetting[]>();
  const [loading, setLoading] = useState(true);
  const [hasUpdateGroupSettings, setHasUpdateGroupSettings] = useState(false);
  const [hasUpdateParticipantSettings, setHasUpdateParticipantSettings] =
    useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [canManageAntiPrint, setCanManageAntiPrint] = useState(false);

  useEffect(() => {
    if (!isOpen || !groupId) return;

    (async () => {
      setLoading(true);
      try {
        const groupRes = await api.get(`/group/${groupId}`);
        const participantRes = await api.get(`/group/participant/${groupId}`);

        if (groupRes.status === 200) {
          setGroup(groupRes.data);
        }

        if (participantRes.status === 200) {
          setParticipant(participantRes.data.participant);
          setParticipantSettings(
            uniqueSettings(
              participantRes.data.participant.participant_settings,
            ),
          );

          if (groupRes.data.type === "DIRECT") {
            const participantSettingsRes = await api.get(
              `/group/participant/settings/${participantRes.data.participant.id}`,
            );
            if (participantSettingsRes.status === 200) {
              setParticipantSettings(
                uniqueSettings(
                  participantSettingsRes.data.settings ||
                    participantSettingsRes.data,
                ),
              );
            }
          }
        }

        const canAccessGroupSettings = rolesForEditConfigs.includes(
          participantRes.data.participant.role,
        );

        if (
          groupRes.status === 200 &&
          groupRes.data.type === "GROUP" &&
          canAccessGroupSettings
        ) {
          const groupSettingsRes = await api.get(`/group/settings/${groupId}`);
          if (groupSettingsRes.status === 200) {
            setGroupSettings(
              uniqueSettings(
                groupSettingsRes.data.settings || groupSettingsRes.data,
              ),
            );
          }
        }
      } catch (error) {
        console.error("Erro ao carregar as configurações:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId, isOpen]);

  useEffect(() => {
    if (!participant) return;
    const antiPrintRoles = [
      ParticipantRoles.ADMIN,
      ParticipantRoles.MANAGER,
      ParticipantRoles.OWNER,
    ];

    setShowGroupSettings(rolesForEditConfigs.includes(participant.role));
    setCanManageAntiPrint(antiPrintRoles.includes(participant.role));
  }, [participant]);

  const updateGroupSetting = (settingName: string, newValue: any) => {
    const updatedSettings = (groupSettings || []).map((setting) =>
      setting.setting_name === settingName
        ? { ...setting, setting_value: String(newValue) }
        : setting,
    );
    setHasUpdateGroupSettings(true);
    setGroupSettings(updatedSettings);
  };

  const updateParticipantSetting = (settingName: string, newValue: any) => {
    const updatedSettings = (participantSettings || []).map((setting) =>
      setting.setting_name === settingName
        ? { ...setting, setting_value: String(newValue) }
        : setting,
    );
    setHasUpdateParticipantSettings(true);
    setParticipantSettings(updatedSettings);
  };

  const handleSubmitGroupSettings = async () => {
    if (!hasUpdateGroupSettings && !hasUpdateParticipantSettings) return;
    setLoading(true);

    try {
      if (
        hasUpdateGroupSettings &&
        rolesForEditConfigs.includes(participant.role)
      ) {
        const res = await api.patch(`/group/settings/${groupId}`, {
          settings: groupSettings,
        });
        if (res.status === 200) {
          setGroupSettings(uniqueSettings(res.data));
          setHasUpdateGroupSettings(false);
        }
      }

      if (hasUpdateParticipantSettings) {
        const personalSettings = (participantSettings || []).map(
          ({ setting_name, setting_value }) => ({
            setting_name,
            setting_value: String(setting_value),
          }),
        );
        const res = await api.patch(
          `/group/participant/settings/${participant.id}`,
          { settings: personalSettings },
        );
        if (res.status === 200) {
          setParticipantSettings(uniqueSettings(res.data));
          setHasUpdateParticipantSettings(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async () => {
    if (window.confirm("Deseja realmente apagar o grupo?")) {
      const res = await api.delete(`/group/${groupId}`);
      if (res.status === 204) {
        onClose();
        navigate("/");
      }
    }
  };

  const exitGroup = async () => {
    if (window.confirm("Deseja realmente sair do grupo?")) {
      const res = await api.delete(`/group/participant/exit/${groupId}`);
      if (res.status === 204) {
        onClose();
        navigate("/");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {group.type === "GROUP" ? "Opções do Grupo" : "Opções da Conversa"}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        {loading ? (
          <Loading />
        ) : (
          <ModalBody>
            {group.type === "GROUP" && (
              <OptionsGroup>
                <SectionTitle>Geral</SectionTitle>
                <OptionItem
                  onClick={() => navigate(`/chat/${groupId}/participants`)}
                >
                  <Users size={18} />
                  <OptionText>Participantes</OptionText>
                </OptionItem>

                {rolesForInvite.includes(participant.role) && (
                  <OptionItem
                    onClick={() => navigate(`/chat/${groupId}/invite`)}
                  >
                    <UserPlus size={18} />
                    <OptionText>Convidar Usuários</OptionText>
                  </OptionItem>
                )}

                {rolesForEditGroup.includes(participant.role) && (
                  <OptionItem onClick={() => navigate(`/chat/${groupId}/edit`)}>
                    <Edit3 size={18} />
                    <OptionText>Editar Grupo</OptionText>
                  </OptionItem>
                )}

                <OptionItem
                  onClick={() => navigate(`/chat/${groupId}/details`)}
                >
                  <FileText size={18} />
                  <OptionText>Detalhes do Grupo</OptionText>
                </OptionItem>

                {showGroupSettings &&
                  groupSettings
                    ?.filter((s) => s.setting_name !== "anti_print")
                    .map((setting) => (
                      <OptionItem key={setting.id} as="div">
                        <Info size={18} />
                        <OptionText>{setting.setting_name}</OptionText>
                        <OptionAction>
                          {setting.input_type === "switch" && (
                            <Switch
                              type="checkbox"
                              checked={setting.setting_value === "true"}
                              onChange={(e) =>
                                updateGroupSetting(
                                  setting.setting_name,
                                  e.target.checked,
                                )
                              }
                            />
                          )}
                          {setting.input_type === "participant_role" && (
                            <Select
                              value={setting.setting_value}
                              onChange={(e) =>
                                updateGroupSetting(
                                  setting.setting_name,
                                  e.target.value,
                                )
                              }
                            >
                              <option value={ParticipantRoles.PARTICIPANT}>
                                Participante
                              </option>
                              <option value={ParticipantRoles.MODERATOR}>
                                Moderador
                              </option>
                              <option value={ParticipantRoles.MANAGER}>
                                Gerente
                              </option>
                              <option value={ParticipantRoles.ADMIN}>
                                Administrador
                              </option>
                            </Select>
                          )}
                        </OptionAction>
                      </OptionItem>
                    ))}

                {canManageAntiPrint && (
                  <OptionItem as="div">
                    <Shield size={18} />
                    <OptionText>Anti-Print / Captura</OptionText>
                    <OptionAction>
                      <Switch
                        type="checkbox"
                        checked={isSettingEnabled(
                          groupSettings?.find(
                            (s) => s.setting_name === "anti_print",
                          ),
                        )}
                        onChange={(e) =>
                          updateGroupSetting("anti_print", e.target.checked)
                        }
                      />
                    </OptionAction>
                  </OptionItem>
                )}
              </OptionsGroup>
            )}

            <OptionsGroup>
              <SectionTitle>Preferências Pessoais</SectionTitle>
              {participantSettings
                ?.filter(
                  (s) =>
                    group.type === "DIRECT" || s.setting_name !== "anti_print",
                )
                .map((setting) => (
                  <OptionItem key={setting.id} as="div">
                    <Info size={18} />
                    <OptionText>{setting.setting_name}</OptionText>
                    <OptionAction>
                      {setting.input_type === "switch" && (
                        <Switch
                          type="checkbox"
                          checked={isSettingEnabled(setting)}
                          onChange={(e) =>
                            updateParticipantSetting(
                              setting.setting_name,
                              e.target.checked,
                            )
                          }
                        />
                      )}
                    </OptionAction>
                  </OptionItem>
                ))}
            </OptionsGroup>

            {group.type === "GROUP" && (
              <OptionsGroup>
                <SectionTitle $danger>Zona de Perigo</SectionTitle>
                {(participant.role === ParticipantRoles.OWNER ||
                  rolesForDeleteGroup.includes(participant.role)) && (
                  <OptionItem $danger onClick={deleteGroup}>
                    <Trash2 size={18} />
                    <OptionText $danger>Excluir Grupo</OptionText>
                  </OptionItem>
                )}
                {participant.role !== ParticipantRoles.OWNER && (
                  <OptionItem $danger onClick={exitGroup}>
                    <LogOut size={18} />
                    <OptionText $danger>Sair do Grupo</OptionText>
                  </OptionItem>
                )}
              </OptionsGroup>
            )}
          </ModalBody>
        )}

        {(hasUpdateGroupSettings || hasUpdateParticipantSettings) && (
          <SaveFAB
            onClick={handleSubmitGroupSettings}
            title="Salvar Alterações"
          >
            <Save size={20} />
          </SaveFAB>
        )}
      </ModalCard>
    </Overlay>
  );
};

export default GroupConfigModal;
