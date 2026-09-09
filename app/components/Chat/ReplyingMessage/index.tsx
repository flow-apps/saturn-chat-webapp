import React, { useState } from "react";
import { CornerUpRight, FileText, Mic } from "lucide-react";
import { MessageData } from "~/types/interfaces";
import { secondsToTime } from "~/utils/format";

import {
  Container,
  ReplyingTitleContainer,
  ReplyingTitle,
  ReplyingMessageWrapper,
  ReplyingMessageAuthorWrapper,
  ReplyingMessageAuthorName,
  ReplyingMessageContentContainer,
  ReplyingMessageContent,
  ReadMoreButton,
} from "./styles";

interface ReplyingMessageProps {
  replying_message: MessageData;
}

const ReplyingMessage = ({ replying_message }: ReplyingMessageProps) => {
  const [readAll, setReadAll] = useState(false);

  const handleReadMore = () => {
    setReadAll((old) => !old);
  };

  const getMessageContent = () => {
    const { files, message, voice_message } = replying_message;

    if (files?.length) {
      if (message) {
        return (
          <ReplyingMessageContent $readAll={readAll}>
            <FileText size={14} style={{ display: "inline", marginRight: 4 }} />
            ({files.length} arquivo{files.length > 1 ? "s" : ""}) {message}
          </ReplyingMessageContent>
        );
      }
      return (
        <ReplyingMessageContent $readAll={readAll}>
          <FileText size={14} style={{ display: "inline", marginRight: 4 }} />
          {files.length} arquivo{files.length > 1 ? "s" : ""}
        </ReplyingMessageContent>
      );
    }

    if (voice_message) {
      // Converte duração de milissegundos para segundos se necessário
      const durationSeconds =
        voice_message.duration > 1000
          ? Math.round(voice_message.duration / 1000)
          : voice_message.duration;

      return (
        <ReplyingMessageContent $readAll={readAll}>
          <Mic size={14} style={{ display: "inline", marginRight: 4 }} />
          Mensagem de voz ({secondsToTime(durationSeconds)})
        </ReplyingMessageContent>
      );
    }

    return (
      <ReplyingMessageContent $readAll={readAll}>
        {message}
      </ReplyingMessageContent>
    );
  };

  const messageTextLength = replying_message.message?.length || 0;

  return (
    <Container>
      <ReplyingTitleContainer>
        <ReplyingTitle>
          <CornerUpRight size={12} style={{ display: "inline", marginRight: 4 }} />
          Respondendo a
        </ReplyingTitle>
      </ReplyingTitleContainer>

      <ReplyingMessageWrapper>
        <ReplyingMessageAuthorWrapper>
          <ReplyingMessageAuthorName>
            {replying_message.author?.name}
          </ReplyingMessageAuthorName>
        </ReplyingMessageAuthorWrapper>

        <ReplyingMessageContentContainer>
          {getMessageContent()}

          {messageTextLength > 80 && (
            <ReadMoreButton onClick={handleReadMore}>
              {readAll ? "[ler menos]" : "[ler mais]"}
            </ReadMoreButton>
          )}
        </ReplyingMessageContentContainer>
      </ReplyingMessageWrapper>
    </Container>
  );
};

export default ReplyingMessage;