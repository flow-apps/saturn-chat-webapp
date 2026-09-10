import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Phone,
  Users,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import _ from "lodash";

import {
  GroupData,
  MessageData,
  ParticipantsData,
  UserData,
} from "~/types/interfaces";
import { ParticipantRoles } from "~/types/enums";

import Loading from "~/components/Loading";
import Message from "~/components/Chat/Message";
import Typing from "~/components/Chat/Typing";
import LoadingIndicator from "~/components/LoadingIndicator";
import Alert from "~/components/Alert";
import { PollModal } from "~/components/Chat/PollModal";
import { ChatInput } from "~/components/Chat/ChatInput";
import GroupConfigModal from "~/components/GroupConfigModal";

import api from "~/services/api";
import { useAuth } from "~/contexts/auth";
import { useWebsocket } from "~/contexts/websocket";
import { useChat } from "~/contexts/chat";
import { useChatMessages } from "~/hooks/useChatMessages";
import { useChatAudio } from "~/hooks/useChatAudio";
import { usePersistedState } from "~/hooks/usePersistedState";
import {
  isScreenshotBlocked,
  useScreenshotProtection,
} from "~/hooks/useScreenshotProtection";

import { File, ordernedRolesArray } from "./types";
import {
  Container,
  ChatHeader,
  GroupAvatar,
  HeaderInfo,
  HeaderActions,
  IconButton,
  MessagesScrollContainer,
  ScrollToBottomButton,
  MessageItemWrapper,
} from "./styles";
import { getEffectiveSettingValue, getSettingValue } from "~/utils/settings";

const MESSAGES_LIMIT_REQUEST = 50;

interface AlertConfigState {
  visible: boolean;
  title: string;
  content: string;
  extraButton?: boolean;
  extraButtonText?: string;
  extraButtonAction?: () => void;
  okButtonAction?: () => void;
}

export const Chat: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();

  // 1. Pegamos os parâmetros da URL
  const [searchParams] = useSearchParams();
  const friendNameParam = searchParams.get("name");
  const friendIdParam = searchParams.get("friendId");

  const navigate = useNavigate();

  const { user } = useAuth();
  const { socket } = useWebsocket();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false);

  const [draftMessage, setDraftMessage, isDraftFetched] =
    usePersistedState<string>(`@saturnchat:draft:${id}`, "");

  const {
    oldMessages,
    setOldMessages,
    fetching,
    fetchedAll,
    fetchOldMessages,
    sortMessages,
    setFetchedAll,
    setPage,
  } = useChatMessages(id);

  const [isPollModalVisible, setIsPollModalVisible] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [, setFilesSizeUsed] = useState<number>(0);
  const [sendingFile, setSendingFile] = useState<boolean>(false);
  const [sendedFileProgress, setSendedFileProgress] = useState<number>(0);
  const [typingUsers] = useState<UserData[]>([]);
  const [replyingMessage, setReplyingMessage] = useState<
    MessageData | undefined
  >();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [participant, setParticipant] = useState<ParticipantsData | null>(null);
  const [participants, setParticipants] = useState<ParticipantsData[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [canSendMessage, setCanSendMessage] = useState<boolean>(true);
  const initialLoadDone = useRef<boolean>(false);
  const currentJoinedRoomRef = useRef<string | null>(null);

  const [alertConfig, setAlertConfig] = useState<AlertConfigState>({
    visible: false,
    title: "",
    content: "",
  });

  const antiPrintSetting =
    group?.type === "DIRECT"
      ? getEffectiveSettingValue(
          participant?.participant_settings ?? [],
          "anti_print",
        )
      : getSettingValue(group?.group_settings ?? [], "anti_print");

  const screenshotBlocked = isScreenshotBlocked({
    antiPrint: antiPrintSetting === true || antiPrintSetting === "true",
    conversationType: group?.type,
    settingsLoading: loading || !group?.id || !participant?.id,
  });

  useScreenshotProtection(
    screenshotBlocked,
    loading || !group?.id || !participant?.id,
    `chat-${id}`,
  );

  const hideAlert = useCallback((): void => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  const {
    handleJoinRoom,
    handleSetTyping,
    handleSendMessage,
    handleSendVoiceMessage,
    onNewUserMessage,
    onSendedUserMessage,
    onDeleteUserMessage,
    connected,
    currentGroupId,
  } = useChat();

  const scrollToBottom = useCallback((): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  const handleScroll = (): void => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    const absScrollTop = Math.abs(scrollTop);
    const isUp = absScrollTop > 200;
    setShowScrollToBottom(isUp);

    const isAtTop = absScrollTop + clientHeight >= scrollHeight - 50;

    if (isAtTop && !fetching && !fetchedAll) {
      fetchOldMessages();
    }
  };

  const handleCreatePoll = useCallback(
    (pollData: {
      question: string;
      options: string[];
      allows_multiple: boolean;
    }): void => {
      if (id !== currentGroupId || !connected || !group || !participant) {
        setAlertConfig({
          visible: true,
          title: "Erro",
          content: "Não foi possível conectar à sala para criar a enquete.",
        });
        return;
      }

      const localReference = crypto.randomUUID();

      const optimisticPollMessage: MessageData = {
        id: localReference,
        localReference,
        author: user as UserData,
        group,
        participant,
        message: "",
        sended: false,
        created_at: new Date().toISOString(),
        poll: {
          id: `temp_poll_${localReference}`,
          message_id: localReference,
          question: pollData.question,
          allows_multiple: pollData.allows_multiple,
          options: pollData.options.map((optText, index) => ({
            id: `temp_opt_${index}_${localReference}`,
            poll_id: `temp_poll_${localReference}`,
            option_text: optText,
            votes_count: 0,
            votes: [],
            created_at: new Date().toISOString(),
          })),
          created_at: new Date().toISOString(),
        } as any,
      };

      setOldMessages((old: MessageData[]) =>
        sortMessages(
          _.uniqBy([optimisticPollMessage, ...old], "id") as MessageData[],
        ),
      );

      setTimeout(() => scrollToBottom(), 50);

      socket?.emit("new_poll", {
        group_id: id,
        question: pollData.question,
        options: pollData.options,
        allows_multiple: pollData.allows_multiple,
        reply_to_id: replyingMessage?.id,
        localReference,
      });

      setReplyingMessage(undefined);
    },
    [
      id,
      currentGroupId,
      connected,
      socket,
      replyingMessage,
      user,
      group,
      participant,
      sortMessages,
      scrollToBottom,
      setOldMessages,
    ],
  );

  const buildOptimisticMessage = useCallback(
    (data: Partial<MessageData> & { localReference: string }): MessageData => ({
      id: data.id || data.localReference,
      author: user as UserData,
      group: group as GroupData,
      participant: participant as ParticipantsData,
      message: data.message || "",
      files: data.files || [],
      voice_message: data.voice_message,
      sended: false,
      localReference: data.localReference,
      reply_to: data.reply_to,
      mentions: data.mentions,
      created_at: new Date().toISOString(),
    }),
    [group, participant, user],
  );

  const handleSendVoice = useCallback(
    async (duration: number, audioFile: globalThis.File): Promise<void> => {
      try {
        const localReference = crypto.randomUUID();
        const audioData = new FormData();
        audioData.append("duration", String(duration));
        audioData.append("attachment", audioFile);

        const optimisticAudio = buildOptimisticMessage({
          localReference,
          voice_message: {
            name: audioFile.name,
            duration,
            size: audioFile.size,
            url: URL.createObjectURL(audioFile),
          },
          reply_to: replyingMessage,
        });

        setOldMessages((old: MessageData[]) =>
          sortMessages(
            _.uniqBy([optimisticAudio, ...old], "id") as MessageData[],
          ),
        );

        setTimeout(() => scrollToBottom(), 50);

        const res = await api.post(
          `/messages/SendAttachment/${id}?type=voice_message`,
          audioData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        setOldMessages((old: MessageData[]) =>
          old.map((m: MessageData) =>
            m.localReference === localReference
              ? {
                  ...m,
                  voice_message: res.data?.voice_message ?? res.data,
                  sended: true,
                }
              : m,
          ),
        );

        handleSendVoiceMessage({
          audio: res.data,
          reply_to_id: replyingMessage?.id ?? "",
          message: "",
          localReference,
        });

        setReplyingMessage(undefined);
      } catch (error) {
        console.error("Send Voice Message Error:", error);
        setAlertConfig({
          visible: true,
          title: "Erro",
          content:
            "Não foi possível enviar a mensagem de voz. Tente novamente.",
        });
      }
    },
    [
      buildOptimisticMessage,
      replyingMessage,
      setOldMessages,
      sortMessages,
      scrollToBottom,
      id,
      handleSendVoiceMessage,
    ],
  );

  const handleVoiceCallback = useCallback(
    (duration: number, audioFile: globalThis.File) => {
      return handleSendVoice(duration, audioFile);
    },
    [handleSendVoice],
  );

  const {
    isRecording,
    audioDuration,
    recordAudio,
    stopRecordAudioAndSubmit,
    cancelRecordAudio,
  } = useChatAudio(handleVoiceCallback);

  const handleFileSelect = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const fetchParticipantAndGroup = useCallback(
    async (isSilent = false): Promise<void> => {
      if (!isSilent && !initialLoadDone.current) {
        setLoading(true);
      }

      try {
        const [pRes, mRes, listRes] = await Promise.all([
          api.get(`/group/participant/${id}`),
          api.get(`/messages/${id}?_page=0&_limit=${MESSAGES_LIMIT_REQUEST}`),
          api.get(`/group/participants/list/?group_id=${id}&_limit=200`),
        ]);
        if (pRes.status === 200) {
          setParticipant(pRes.data.participant);
          setGroup(pRes.data.participant.group);
        }
        if (listRes.status === 200) setParticipants(listRes.data);

        if (mRes.data.messages.length < MESSAGES_LIMIT_REQUEST)
          setFetchedAll(true);

        setOldMessages(
          sortMessages(_.uniqBy(mRes.data.messages, "id") as MessageData[]),
        );
        setPage(1);
      } catch (error) {
        console.error("Chat: fetchParticipantAndGroup Error", error);
      } finally {
        initialLoadDone.current = true;
        setLoading(false);
      }
    },
    [id, setFetchedAll, setOldMessages, setPage, sortMessages],
  );

  const handleMessageSubmit = async (
    message: string,
    selectedFiles: File[],
    mentionIds: string[],
  ): Promise<void> => {
    if (id !== currentGroupId || !connected) {
      setAlertConfig({
        visible: true,
        title: "Erro",
        content: "Sem conexão com o chat no momento.",
      });
      return;
    }
    const localReference = crypto.randomUUID();

    setDraftMessage("");

    const optimisticMsg = buildOptimisticMessage({
      localReference,
      message,
      files: selectedFiles.map((f) => ({
        id: f.file.name,
        original_name: f.file.name,
        name: f.file.name,
        size: f.file.size || 0,
        type: f.type,
        url: URL.createObjectURL(f.file),
      })),
      reply_to: replyingMessage,
      mentions: mentionIds,
    });

    setOldMessages((old: MessageData[]) =>
      sortMessages(_.uniqBy([optimisticMsg, ...old], "id") as MessageData[]),
    );

    setTimeout(() => scrollToBottom(), 50);

    if (selectedFiles.length === 0) {
      handleSendMessage({
        withFiles: false,
        reply_to_id: replyingMessage?.id,
        message,
        localReference,
        mentions: mentionIds,
      });
    } else {
      setSendingFile(true);
      const filesData = new FormData();
      selectedFiles.forEach((f) => filesData.append("attachment", f.file));
      filesData.append("message", message);
      if (replyingMessage) filesData.append("reply_to_id", replyingMessage.id);
      if (mentionIds.length > 0)
        filesData.append("mentions", JSON.stringify(mentionIds));

      try {
        const res = await api.post(
          `messages/SendAttachment/${id}?type=files`,
          filesData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) =>
              setSendedFileProgress(
                Math.round((e.loaded * 100) / (e.total || 1)),
              ),
          },
        );
        if (res.status === 200)
          handleSendMessage({
            message_id: res.data.message_id,
            message,
            withFiles: true,
            localReference,
            mentions: mentionIds,
          });
      } catch (error) {
        console.error("Send File Error:", error);
        setAlertConfig({
          visible: true,
          title: "Erro",
          content: "Não foi possível enviar os arquivos anexados.",
        });
      } finally {
        setFiles([]);
        setSendingFile(false);
        setSendedFileProgress(0);
        setFilesSizeUsed(0);
      }
    }
    setReplyingMessage(undefined);
  };

  useEffect(() => {
    if (!id || currentJoinedRoomRef.current === id) return;

    currentJoinedRoomRef.current = id;

    handleJoinRoom(id);
    fetchParticipantAndGroup(false);

    return () => {
      currentJoinedRoomRef.current = null;
    };
  }, [id, handleJoinRoom, fetchParticipantAndGroup]);

  useEffect(() => {
    if (group?.id !== currentGroupId) {
      fetchParticipantAndGroup(false);
    }
  }, [currentGroupId, fetchParticipantAndGroup, group?.id]);

  useEffect(() => {
    if (!connected || currentGroupId !== id) return;

    const unsubscribeNewMessage = onNewUserMessage(
      (newMessage: MessageData) => {
        if (newMessage.group?.id === id || newMessage.group === id) {
          setOldMessages((old: MessageData[]) => {
            const exists = old.some(
              (m) =>
                m.id === newMessage.id ||
                (newMessage.localReference &&
                  m.localReference === newMessage.localReference),
            );
            if (exists) return old;
            return sortMessages([...old, newMessage] as MessageData[]);
          });
          setTimeout(() => scrollToBottom(), 50);
        }
      },
    );

    const unsubscribeSended = onSendedUserMessage(({ msg, localReference }) => {
      setOldMessages((old: MessageData[]) =>
        old.map((m) =>
          m.localReference === localReference ? { ...msg, sended: true } : m,
        ),
      );
    });

    const unsubscribeDelete = onDeleteUserMessage(({ id: messageId }) => {
      setOldMessages((old: MessageData[]) =>
        old.filter((m) => m.id !== messageId),
      );
    });

    return () => {
      unsubscribeNewMessage();
      unsubscribeSended();
      unsubscribeDelete();
    };
  }, [
    connected,
    currentGroupId,
    id,
    onNewUserMessage,
    onSendedUserMessage,
    onDeleteUserMessage,
    sortMessages,
    scrollToBottom,
    setOldMessages,
  ]);

  useEffect(() => {
    if (!participant || !group) return;
    if (participant.role === ParticipantRoles.OWNER)
      return setCanSendMessage(true);
    const pRoleIdx = ordernedRolesArray.indexOf(participant.role);
    const minRoleIdx = ordernedRolesArray.indexOf(
      group.group_settings?.minimum_role_for_send_message,
    );
    setCanSendMessage(pRoleIdx >= minRoleIdx);
  }, [participant, group]);

  if (loading || !group?.id || !participant?.id) {
    return <Loading />;
  }

  const isDirect = group?.type === "DIRECT";

  const friendParticipant = isDirect
    ? participants.find((p: any) => {
        const participantUserId = p.user?.id || p.user_id;
        return participantUserId !== user?.id;
      })
    : null;

  const otherUser = friendParticipant?.user || (friendParticipant as any);

  const headerTitle =
    friendNameParam ||
    otherUser?.name ||
    otherUser?.nickname ||
    group?.name ||
    "Conversa";

  const headerAvatar =
    (isDirect
      ? otherUser?.avatar?.url || otherUser?.profile_avatar?.url
      : group?.group_avatar?.url) || "/avatar-placeholder.jpg";

  const targetFriendId = friendIdParam || otherUser?.id;

  return (
    <Container>
      <Alert
        visible={alertConfig.visible}
        title={alertConfig.title}
        content={alertConfig.content}
        okButtonAction={alertConfig.okButtonAction || hideAlert}
      />

      <PollModal
        visible={isPollModalVisible}
        onClose={() => setIsPollModalVisible(false)}
        onSubmit={handleCreatePoll}
      />

      <GroupConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        groupId={id}
      />

      {/* HEADER DO CHAT */}
      <ChatHeader>
        <IconButton title="Voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </IconButton>

        <GroupAvatar
          src={headerAvatar}
          alt={headerTitle}
          onClick={() =>
            group.type === "GROUP"
              ? navigate(`/group-info/${id}`)
              : targetFriendId && navigate(`/user-profile/${targetFriendId}`)
          }
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/avatar-placeholder.jpg";
          }}
        />

        <HeaderInfo
          onClick={() =>
            group.type === "GROUP"
              ? navigate(`/group-info/${id}`)
              : targetFriendId && navigate(`/user-profile/${targetFriendId}`)
          }
        >
          <h3>{headerTitle}</h3>
          {group.type === "GROUP" && <span>{participants.length} membros</span>}
        </HeaderInfo>

        <HeaderActions>
          <IconButton title="Iniciar chamada">
            <Phone size={20} />
          </IconButton>
          {group.type === "GROUP" && (
            <IconButton
              title="Membros"
              onClick={() => navigate(`/participants/${id}`)}
            >
              <Users size={20} />
            </IconButton>
          )}
          <IconButton title="Opções" onClick={() => setIsConfigModalOpen(true)}>
            <MoreVertical size={20} />
          </IconButton>
        </HeaderActions>
      </ChatHeader>

      {/* ÁREA DE MENSAGENS E SCROLL */}
      <MessagesScrollContainer ref={scrollContainerRef} onScroll={handleScroll}>
        <Typing typingUsers={typingUsers} />

        {oldMessages.map((item, index) => (
          <MessageItemWrapper
            key={item.id || item.localReference}
            as={motion.div}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Message
              message={item}
              participant={participant}
              lastMessage={index > 0 ? oldMessages[index - 1] : null}
              onReplyMessage={setReplyingMessage}
              group={group}
              disableReply={!canSendMessage}
              participants={participants}
              antiPrint={screenshotBlocked}
            />
          </MessageItemWrapper>
        ))}

        {fetching && !fetchedAll && <LoadingIndicator />}
      </MessagesScrollContainer>

      {/* BOTÃO FLUTUANTE PARA ROLAR ATÉ O FIM */}
      <AnimatePresence>
        {showScrollToBottom && (
          <ScrollToBottomButton
            as={motion.button}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
          >
            <ChevronDown size={22} />
          </ScrollToBottomButton>
        )}
      </AnimatePresence>

      {/* COMPONENTE DE INPUT */}
      <ChatInput
        groupId={id}
        canSendMessage={canSendMessage}
        maxMessageLength={500}
        replyingMessage={replyingMessage}
        sendingFile={sendingFile}
        sendedFileProgress={sendedFileProgress}
        isRecording={isRecording}
        audioDuration={audioDuration}
        onSendMessage={handleMessageSubmit}
        onRecordAudioStart={(hasText) => recordAudio(hasText)}
        onRecordAudioStop={stopRecordAudioAndSubmit}
        onRecordAudioCancel={cancelRecordAudio}
        onFileSelect={handleFileSelect}
        onRemoveFile={(idx) => setFiles(files.filter((_, i) => i !== idx))}
        onRemoveReplying={() => setReplyingMessage(undefined)}
        onTyping={() => handleSetTyping({ action: "ADD" })}
        onTypingTimeout={() => handleSetTyping({ action: "REMOVE" })}
        onOpenPollModal={() => setIsPollModalVisible(true)}
        files={files}
        initialValue={isDraftFetched ? draftMessage : ""}
        onChangeText={setDraftMessage}
      />
    </Container>
  );
};

export default Chat;
