import React, { memo, useCallback, useMemo, useEffect } from "react";
import {
  CornerUpRight,
  Copy,
  Globe,
  Trash2,
  AlertOctagon,
  User,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "~/contexts/auth";
import { IMessageOptionsProps, IOptions } from "./types";
import {
  Overlay,
  MessageOptionsContainer,
  MessageInfosContainer,
  MessageAvatar,
  MessageInfos,
  UserName,
  MessageText,
  MessageOptionsModal,
  Option,
  OptionText,
} from "./styles";

// Mapeamento dos nomes de ícones do Feather para componentes do Lucide
const renderOptionIcon = (iconName?: string, color?: string) => {
  if (!iconName) return null;

  const props = { size: 18, color };

  switch (iconName) {
    case "corner-up-right":
      return <CornerUpRight {...props} />;
    case "copy":
      return <Copy {...props} />;
    case "globe":
      return <Globe {...props} />;
    case "trash-2":
      return <Trash2 {...props} />;
    case "alert-octagon":
      return <AlertOctagon {...props} />;
    case "user":
      return <User {...props} />;
    default:
      return <MoreHorizontal {...props} />;
  }
};

const MessageOptions = ({
  visible,
  close,
  message,
  options = [],
  participant_role,
  group,
}: IMessageOptionsProps) => {
  const { user } = useAuth();

  const handleExecAction = useCallback(
    (action?: () => void) => {
      close();
      if (action) {
        action();
      }
    },
    [close]
  );

  const canShowOptionChecker = useCallback(
    (option: IOptions) => {
      const roles = option.authorizedRoles;
      const groupType = group?.type;
      const authorId = message?.author?.id;
      const currentUserId = user?.id;

      if (!option.showInDM && groupType === "DIRECT") return false;
      if (
        option.onlyOwner &&
        authorId !== currentUserId &&
        groupType === "DIRECT"
      )
        return false;
      if (roles?.[0] === "ALL") return true;
      if (
        option.onlyOwner &&
        authorId !== currentUserId &&
        !roles?.includes(participant_role)
      )
        return false;
      if (!option.showForAuthor && authorId === currentUserId) return false;

      return true;
    },
    [group?.type, message?.author?.id, participant_role, user?.id]
  );

  const visibleOptions = useMemo(() => {
    return options.filter((option) => canShowOptionChecker(option));
  }, [options, canShowOptionChecker]);

  // Suporte para fechar o menu com a tecla 'Escape' no navegador
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && visible) {
        close();
      }
    };

    if (visible) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, close]);

  if (!visible) return null;

  return (
    <Overlay onClick={close}>
      <MessageOptionsContainer onClick={(e) => e.stopPropagation()}>
        <MessageInfosContainer>
          <MessageAvatar
            src={message.author?.avatar?.url || "/avatar-placeholder.jpg"}
            alt={message.author?.name || "Avatar"}
          />
          <MessageInfos>
            <UserName>{message.author?.name}</UserName>
            {!!message.message && <MessageText>{message.message}</MessageText>}
          </MessageInfos>
        </MessageInfosContainer>

        <MessageOptionsModal>
          {visibleOptions.map((option, idx) => (
            <Option
              key={option.content || idx}
              onClick={() => handleExecAction(option.action)}
            >
              {renderOptionIcon(option.iconName, option.color)}
              <OptionText $color={option.color}>{option.content}</OptionText>
            </Option>
          ))}
        </MessageOptionsModal>
      </MessageOptionsContainer>
    </Overlay>
  );
};

export default memo(MessageOptions);