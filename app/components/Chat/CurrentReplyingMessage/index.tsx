import React, { memo } from "react";
import { Mic, FileMinus, CornerUpRight, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { MessageData } from "~/types/interfaces";
import { secondsToTime } from "~/utils/format";

import {
  ReplyingMessageContainer,
  ReplyingMessageContentContainer,
  ReplyingMessageTitleWrapper,
  ReplyingMessageTitle,
  ReplyingMessageAuthorNameWrapper,
  ReplyingMessageAuthorName,
  ReplyingMessageWrapper,
  ReplyingMessageText,
  ReplyingMessageRemoveContainer,
  ReplyingMessageRemoveButton,
} from "./styles";

interface CurrentReplyingMessageProps {
  message: MessageData;
  onRemoveReplying: () => void;
}

const CurrentReplyingMessage = ({
  message,
  onRemoveReplying,
}: CurrentReplyingMessageProps) => {
  const renderMessageContent = () => {
    if (message.voice_message) {
      const durationSeconds =
        message.voice_message.duration > 1000
          ? Math.round(message.voice_message.duration / 1000)
          : message.voice_message.duration;

      return (
        <ReplyingMessageText>
          <Mic size={13} style={{ display: "inline", marginRight: 4 }} /> Mensagem de voz (
          {secondsToTime(durationSeconds)})
        </ReplyingMessageText>
      );
    }

    if (message.files?.length) {
      return (
        <ReplyingMessageText>
          (<FileMinus size={13} style={{ display: "inline", marginRight: 4 }} />{" "}
          {message.files.length} arquivo{message.files.length > 1 ? "s" : ""}){" "}
          {message.message ? message.message : ""}
        </ReplyingMessageText>
      );
    }

    if (message.message) {
      return <ReplyingMessageText>{message.message}</ReplyingMessageText>;
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{ width: "100%", overflow: "hidden" }}
    >
      <ReplyingMessageContainer>
        <ReplyingMessageContentContainer>
          <ReplyingMessageTitleWrapper>
            <ReplyingMessageTitle>
              <CornerUpRight size={12} style={{ display: "inline", marginRight: 4 }} />{" "}
              Respondendo à mensagem
            </ReplyingMessageTitle>
          </ReplyingMessageTitleWrapper>

          <ReplyingMessageAuthorNameWrapper>
            <ReplyingMessageAuthorName>
              {message.author?.name}
            </ReplyingMessageAuthorName>
          </ReplyingMessageAuthorNameWrapper>

          <ReplyingMessageWrapper>{renderMessageContent()}</ReplyingMessageWrapper>
        </ReplyingMessageContentContainer>

        <ReplyingMessageRemoveContainer>
          <ReplyingMessageRemoveButton
            onClick={onRemoveReplying}
            type="button"
            title="Cancelar resposta"
          >
            <XCircle size={22} />
          </ReplyingMessageRemoveButton>
        </ReplyingMessageRemoveContainer>
      </ReplyingMessageContainer>
    </motion.div>
  );
};

export default memo(CurrentReplyingMessage, (prev, next) => {
  return prev.message.id === next.message.id;
});