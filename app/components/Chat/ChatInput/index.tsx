import React, { useRef, useState, useEffect, useCallback } from "react";
import { Plus, Paperclip, Send, Mic, Upload, BarChart2 } from "lucide-react";
import { UserData, MessageData } from "~/types/interfaces";
import { File } from "./types";

import SelectedFiles from "~/components/Chat/SelectedFiles";
import CurrentReplyingMessage from "~/components/Chat/CurrentReplyingMessage";
import Mentions from "~/components/Chat/Mentions";
import { AudioRecordingBar } from "~/components/Chat/AudioRecordingBar";

import {
  FormContainer,
  InputContainer,
  MessageInput,
  OptionsContainer,
  OptionsButton,
  SendButton,
  AudioContainer,
  AudioButton,
  PlusButton,
  FileSendedProgressContainer,
  FileSendedText,
  ProgressBarContainer,
  ProgressBarFill,
  NoSendMessageContainer,
  NoSendMessageText,
  ActionsPopoverOverlay,
  ActionsPopover,
  ActionItemButton,
  ActionIconContainer,
  ActionText,
  HiddenFileInput,
} from "./styles";

interface ChatInputProps {
  groupId: string;
  canSendMessage: boolean;
  maxMessageLength: number;
  replyingMessage?: MessageData;
  sendingFile: boolean;
  sendedFileProgress: number;
  isRecording: boolean;
  audioDuration: number;
  onSendMessage: (message: string, files: File[], mentions: string[]) => void;
  onRecordAudioStart: (hasMessage: boolean) => void;
  onRecordAudioStop: () => void;
  onRecordAudioCancel?: () => void;
  onFileSelect: () => void;
  onOpenPollModal: () => void;
  onRemoveFile: (index: number) => void;
  onRemoveReplying: () => void;
  onTyping: () => void;
  onTypingTimeout?: () => void;
  files: File[];
  insetsBottom?: number;
  isKeyboardVisible?: boolean;
  initialValue?: string;
  onChangeText?: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  groupId,
  canSendMessage,
  maxMessageLength,
  replyingMessage,
  sendingFile,
  sendedFileProgress,
  isRecording,
  audioDuration,
  onSendMessage,
  onRecordAudioStart,
  onRecordAudioStop,
  onRecordAudioCancel,
  onFileSelect,
  onOpenPollModal,
  onRemoveFile,
  onRemoveReplying,
  onTyping,
  files,
  initialValue = "",
  onChangeText,
}) => {
  const [textValue, setTextValue] = useState(initialValue);
  const [isTypingMessage, setIsTypingMessage] = useState(
    initialValue.length > 0,
  );
  const [mentionQuery, setMentionQuery] = useState("");
  const [isMentioning, setIsMentioning] = useState(false);
  const [mentions, setMentions] = useState<UserData[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionPosition, setMentionPosition] = useState({ start: 0, end: 0 });
  const [isActionsModalVisible, setIsActionsModalVisible] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza rascunho inicial
  useEffect(() => {
    if (initialValue !== undefined) {
      setTextValue(initialValue);
      setIsTypingMessage(initialValue.length > 0);
    }
  }, [initialValue]);

  // Ajusta altura do textarea dinamicamente conforme digita
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [textValue]);

  const handleSetText = (text: string) => {
    if (text.length > maxMessageLength) return;

    setTextValue(text);
    setIsTypingMessage(text.length > 0);

    const match = /@(\w+)/g.exec(text);
    if (
      match &&
      cursorPosition >= match.index &&
      cursorPosition <= match.index + match[0].length
    ) {
      setMentionQuery(match[1]);
      setMentionPosition({
        start: match.index,
        end: match.index + match[0].length,
      });
      setIsMentioning(true);
    } else {
      setIsMentioning(false);
    }

    setMentions((prev) => prev.filter((m) => text.includes(`@${m.nickname}`)));

    if (onChangeText) {
      onChangeText(text);
    }
    onTyping();
  };

  const handleUserSelect = (selectedUser: UserData) => {
    const newText = `${textValue.substring(0, mentionPosition.start)}@${selectedUser.nickname} ${textValue.substring(mentionPosition.end)}`;

    setTextValue(newText);
    setMentions((prev) => [...prev, selectedUser]);
    setIsMentioning(false);
    setIsTypingMessage(true);

    if (onChangeText) {
      onChangeText(newText);
    }
    onTyping();

    textareaRef.current?.focus();
  };

  const handleSubmit = useCallback(() => {
    if (files.length === 0 && !textValue.trim()) return;

    const messageToSend = textValue;
    setTextValue("");
    setIsTypingMessage(false);

    if (onChangeText) {
      onChangeText("");
    }

    onSendMessage(
      messageToSend,
      files,
      mentions.map((m) => m.id),
    );
    setMentions([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [files, textValue, mentions, onSendMessage, onChangeText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNativeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect();
    }
  };

  if (!canSendMessage) {
    return (
      <NoSendMessageContainer>
        <NoSendMessageText>
          Apenas administradores podem enviar mensagens neste grupo.
        </NoSendMessageText>
      </NoSendMessageContainer>
    );
  }

  return (
    <FormContainer>
      {isMentioning && (
        <Mentions
          query={mentionQuery}
          groupId={groupId}
          onUserSelect={handleUserSelect}
        />
      )}

      {files.length > 0 && !sendingFile && !isRecording && (
        <SelectedFiles files={files} onFileRemove={onRemoveFile} />
      )}

      {sendingFile && (
        <FileSendedProgressContainer>
          <FileSendedText>
            <Upload size={16} /> {sendedFileProgress}% Enviado
          </FileSendedText>
          <ProgressBarContainer>
            <ProgressBarFill $progress={sendedFileProgress} />
          </ProgressBarContainer>
        </FileSendedProgressContainer>
      )}

      {replyingMessage && !isRecording && (
        <CurrentReplyingMessage
          message={replyingMessage}
          onRemoveReplying={onRemoveReplying}
        />
      )}

      {/* Popover/Modal de Opções Extras */}
      {isActionsModalVisible && (
        <ActionsPopoverOverlay onClick={() => setIsActionsModalVisible(false)}>
          <ActionsPopover onClick={(e) => e.stopPropagation()}>
            <ActionItemButton
              type="button"
              onClick={() => {
                setIsActionsModalVisible(false);
                onOpenPollModal();
              }}
            >
              <ActionIconContainer>
                <BarChart2 size={22} />
              </ActionIconContainer>
              <ActionText>Criar Enquete</ActionText>
            </ActionItemButton>
          </ActionsPopover>
        </ActionsPopoverOverlay>
      )}

      {isRecording ? (
        <AudioRecordingBar
          audioDuration={audioDuration}
          onCancel={onRecordAudioCancel || onRecordAudioStop}
          onSend={onRecordAudioStop}
        />
      ) : (
        <InputContainer>
          <PlusButton
            type="button"
            onClick={() => setIsActionsModalVisible((prev) => !prev)}
            title="Mais opções"
          >
            <Plus size={24} />
          </PlusButton>

          <MessageInput
            ref={textareaRef}
            value={textValue}
            onChange={(e) => handleSetText(e.target.value)}
            onKeyDown={handleKeyDown}
            onSelect={(e) =>
              setCursorPosition(
                (e.target as HTMLTextAreaElement).selectionStart,
              )
            }
            maxLength={maxMessageLength}
            placeholder="Digite sua mensagem..."
            rows={1}
          />

          <HiddenFileInput
            type="file"
            ref={fileInputRef}
            onChange={handleNativeFileSelect}
            multiple
          />

          <OptionsContainer>
            <OptionsButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Anexar arquivo"
            >
              <Paperclip size={22} />
            </OptionsButton>

            {isTypingMessage || files.length > 0 ? (
              <SendButton
                type="button"
                onClick={handleSubmit}
                title="Enviar mensagem"
              >
                <Send size={22} />
              </SendButton>
            ) : (
              <AudioContainer>
                <AudioButton
                  type="button"
                  onClick={() => onRecordAudioStart(!!textValue)}
                  title="Gravar áudio"
                >
                  <Mic size={22} />
                </AudioButton>
              </AudioContainer>
            )}
          </OptionsContainer>
        </InputContainer>
      )}
    </FormContainer>
  );
};
