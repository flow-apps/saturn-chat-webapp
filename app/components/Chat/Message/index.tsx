import React, { memo, useCallback, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import URLParser from "url-parse";
import { CornerUpRight, Copy } from "lucide-react";

import config from "~/config";
import {
  GroupData,
  MessageData,
  ParticipantsData,
  UserData,
} from "~/types/interfaces";
import {
  ParticipantRoles,
  ParticipantStates,
  ReportToType,
} from "~/types/enums";
import { rolesForDeleteMessage } from "~/utils/authorizedRoles";
import { LinkUtils } from "~/utils/link";
import { useAuth } from "~/contexts/auth";
import { useChat } from "~/contexts/chat";

import Alert from "~/components/Alert";
import AudioPlayer from "~/components/Chat/AudioPlayer";
import FilePreview from "~/components/Chat/FilePreview";
import MessageOptions from "~/components/Chat/MessageOptions";
import PremiumName from "~/components/PremiumName";
import MessageMark from "~/components/Chat/MessageMark";
import ReplyingMessage from "~/components/Chat/ReplyingMessage";
import InviteInMessage from "~/components/Chat/RichContent/InviteInMessage";
import LinkPreview from "~/components/Chat/RichContent/LinkPreview";
import { PollMessage } from "~/components/Chat/PollMessage";

import {
  Container,
  MessageAuthorContainer,
  MessageAvatar,
  MessageContentContainer,
  MessageDate,
  MessageDateContainer,
  MessageWrapper,
  ActionHoverMenu,
  ActionButton,
} from "./styles";

interface MessageProps {
  participant: ParticipantsData;
  message: MessageData;
  lastMessage: MessageData | null;
  onReplyMessage: (message: MessageData) => void;
  children?: React.ReactNode;
  group: GroupData;
  disableReply: boolean;
  participants: ParticipantsData[];
  antiPrint: boolean;
}

interface InvitesData {
  id: string;
}

const linkUtils = new LinkUtils();

const MessageAuthorHeader = memo(
  ({
    author,
    participantState,
    isPremium,
    isAuthorUser,
    onPress,
  }: {
    author: MessageData["author"];
    participantState?: ParticipantStates;
    isPremium: boolean;
    isAuthorUser: boolean;
    onPress: () => void;
  }) => (
    <MessageAuthorContainer
      onClick={onPress}
      $disabled={participantState !== ParticipantStates.JOINED}
    >
      <MessageAvatar
        src={author?.avatar?.url || "/avatar-placeholder.jpg"}
        alt={author?.name || "Avatar"}
      />
      <PremiumName
        name={author?.name || ""}
        nameSize={12}
        hasPremium={isAuthorUser ? isPremium : author?.isPremium}
      />
    </MessageAuthorContainer>
  ),
);

const Message = ({
  message,
  lastMessage,
  participant,
  onReplyMessage,
  group,
  disableReply,
  participants,
  antiPrint,
}: MessageProps) => {
  const [showLinkAlert, setShowLinkAlert] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [msgOptions, setMsgOptions] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(
    null,
  );
  const [invitesData, setInvitesData] = useState<InvitesData[]>([]);

  const { user } = useAuth();
  const { handleDeleteMessage } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    setTranslatedContent(null);
  }, [message.id, message.localReference]);

  useEffect(() => {
    const text = message.message;
    if (!text || !text.includes("http")) {
      if (invitesData.length > 0) setInvitesData([]);
      return;
    }

    const allLinks = linkUtils.getAllLinksFromText(text);
    const foundInvites: InvitesData[] = [];

    for (let i = 0; i < allLinks.length; i++) {
      const { host, pathname } = new URLParser(allLinks[i]);
      const { isInvite, inviteID } = linkUtils.isInviteLink(host, pathname);
      if (isInvite && inviteID) {
        foundInvites.push({ id: inviteID });
      }
    }

    setInvitesData(foundInvites);
  }, [message.message]);

  const isRight = (message.author?.id || message?.author_id) === user?.id;
  const isSended = message?.sended ?? true;
  const hasInvite = invitesData.length > 0;

  const handleGoParticipant = useCallback(() => {
    if (message.participant?.id) {
      navigate(`/participant/${message.participant.id}`);
    }
  }, [navigate, message.participant]);

  const openLink = useCallback(
    async (passedLink = "") => {
      setShowLinkAlert(false);
      window.open(passedLink || linkUrl, "_blank", "noopener,noreferrer");
      setLinkUrl("");
    },
    [linkUrl],
  );

  const alertLink = useCallback(
    async (link: string) => {
      const { hostname } = new URLParser(link);
      if (config.SATURN_CHAT_DOMAINS?.includes(hostname)) {
        return await openLink(link);
      }
      setLinkUrl(link);
      setShowLinkAlert(true);
    },
    [openLink],
  );

  const closeLink = useCallback(() => {
    setLinkUrl("");
    setShowLinkAlert(false);
  }, []);

  const deleteMessage = useCallback(async () => {
    handleDeleteMessage({ message_id: message.id });
  }, [handleDeleteMessage, message.id]);

  const handleCopyMessage = useCallback(async () => {
    if (!message.message) return;
    try {
      await navigator.clipboard.writeText(message.message);
    } catch (err) {
      console.error("Erro ao copiar texto:", err);
    }
  }, [message.message]);

  const triggerReply = useCallback(() => {
    onReplyMessage(message);
  }, [onReplyMessage, message]);

  const handleCloseMsgOptions = useCallback(() => setMsgOptions(false), []);
  const handleOpenMsgOptions = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMsgOptions(true);
  }, []);

  const handleReportMessage = useCallback(async () => {
    navigate(`/report?type=${ReportToType.MESSAGE}&message_id=${message.id}`);
  }, [navigate, message.id]);

  const optionsList = useMemo(() => {
    const isPoll = !!message.poll;

    return [
      {
        iconName: "corner-up-right",
        content: "Responder",
        action: triggerReply,
        onlyOwner: false,
        authorizedRoles: ["ALL" as ParticipantRoles],
        showInDM: true,
        showForAuthor: true,
      },
      ...(!isPoll
        ? [
            {
              iconName: "copy",
              content: "Copiar texto",
              action: handleCopyMessage,
              onlyOwner: false,
              authorizedRoles: ["ALL" as ParticipantRoles],
              showInDM: true,
              showForAuthor: true,
            },
          ]
        : []),
      {
        iconName: "user",
        content: "Ver Perfil",
        action: handleGoParticipant,
        onlyOwner: false,
        authorizedRoles: ["ALL" as ParticipantRoles],
        showInDM: false,
        showForAuthor: true,
      },
      {
        iconName: "trash-2",
        content: "Apagar",
        action: deleteMessage,
        color: "#ef4444",
        onlyOwner: true,
        authorizedRoles: rolesForDeleteMessage,
        showInDM: true,
        showForAuthor: true,
      },
      {
        iconName: "alert-octagon",
        content: "Denunciar",
        action: handleReportMessage,
        color: "#ef4444",
        onlyOwner: false,
        showInDM: true,
        showForAuthor: false,
      },
    ];
  }, [
    message.poll,
    triggerReply,
    handleCopyMessage,
    handleGoParticipant,
    deleteMessage,
    handleReportMessage,
  ]);

  const isSameAuthorAsLast = lastMessage?.author?.id === message.author?.id;

  return (
    <>
      <Alert
        title="Aviso de Link Externo"
        content={`Você está prestes a abrir o seguinte link fora do Saturn Chat:\n\n${linkUrl}`}
        cancelButtonText="Cancelar"
        okButtonText="Abrir Link"
        cancelButtonAction={closeLink}
        okButtonAction={() => openLink()}
        visible={showLinkAlert}
      />

      <MessageWrapper $isRight={isRight} onContextMenu={handleOpenMsgOptions}>
        <Container $isRight={isRight}>
          {message.reply_to && (
            <ReplyingMessage replying_message={message.reply_to} />
          )}

          <MessageContentContainer
            $isRight={isRight}
            $sended={isSended}
            $hasPoll={!!message.poll}
          >
            {/* Menu flutuante de ações rápidas no Hover para Web */}
            {!disableReply && (
              <ActionHoverMenu className="hover-menu">
                <ActionButton onClick={triggerReply} title="Responder">
                  <CornerUpRight size={14} />
                </ActionButton>
                {message.message && (
                  <ActionButton onClick={handleCopyMessage} title="Copiar">
                    <Copy size={14} />
                  </ActionButton>
                )}
              </ActionHoverMenu>
            )}

            <MessageOptions
              close={handleCloseMsgOptions}
              visible={msgOptions}
              message={message}
              participant_role={participant.role}
              group={group}
              options={optionsList as any}
            />

            {message.message ? (
              <MessageMark
                key={`${message.id}-${translatedContent ? "translated" : "original"}`}
                message={{
                  ...message,
                  message:
                    translatedContent && !message.poll
                      ? translatedContent
                      : message.message,
                }}
                onPressLink={alertLink}
                user={user as UserData}
                participants={participants}
              />
            ) : null}

            {message.poll && (
              <PollMessage poll={message.poll} groupId={group.id} />
            )}

            {message.voice_message && (
              <AudioPlayer audio={message.voice_message} />
            )}

            {message.files &&
              message.files.map((file, idx) => (
                <FilePreview
                  key={file.id || idx}
                  name={file.name}
                  original_name={file.original_name}
                  url={file.url}
                  size={file.size}
                  type={file.type}
                  deleted={false}
                  antiPrint={antiPrint}
                  conversationType={group.type}
                />
              ))}
          </MessageContentContainer>

          {hasInvite &&
            invitesData.map((invite, index) => (
              <InviteInMessage
                key={`${invite.id}-${index}`}
                inviteID={invite.id}
              />
            ))}

          {message.links &&
            message.links.map((link, index) => {
              if (hasInvite) {
                const { host, pathname } = new URLParser(link.link);
                const { isInvite } = linkUtils.isInviteLink(host, pathname);
                if (isInvite) return null;
              }
              return (
                <LinkPreview
                  key={link.id || index}
                  link={link}
                  openLink={alertLink}
                  antiPrint={antiPrint}
                  conversationType={group.type}
                />
              );
            })}

          {(!isSameAuthorAsLast ||
            moment(message.created_at).minutes() !==
              moment(lastMessage?.created_at).minutes()) && (
            <MessageDateContainer>
              <MessageDate>
                {moment(message.created_at).format("DD/MM/yy, HH:mm")}
              </MessageDate>
            </MessageDateContainer>
          )}

          {!isSameAuthorAsLast && (
            <MessageAuthorHeader
              author={message.author}
              participantState={message.participant?.state}
              isPremium={!!user?.isPremium}
              isAuthorUser={isRight}
              onPress={handleGoParticipant}
            />
          )}
        </Container>
      </MessageWrapper>
    </>
  );
};

export default memo(Message, (prev, next) => {
  return (
    prev.message.id === next.message.id &&
    prev.message.localReference === next.message.localReference &&
    prev.message.sended === next.message.sended &&
    prev.message.author?.id === next.message.author?.id &&
    prev.disableReply === next.disableReply &&
    prev.lastMessage?.id === next.lastMessage?.id &&
    prev.participant?.role === next.participant?.role &&
    prev.participant?.state === next.participant?.state &&
    prev.participants === next.participants &&
    JSON.stringify(prev.message.poll) === JSON.stringify(next.message.poll)
  );
});
