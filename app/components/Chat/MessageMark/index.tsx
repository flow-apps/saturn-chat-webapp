import React, { useMemo, useCallback, memo, useState } from "react";
import { useNavigate } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { MessageData, UserData, ParticipantsData } from "~/types/interfaces";
import {
  MessageMarkdownContainer,
  MessageContent,
  MessageLink,
  MessageCodeInline,
  MessageCodeBlock,
  MessageCodeBlockText,
  ExpandButton,
} from "./styles";

interface MessageMarkProps {
  user: UserData;
  message: MessageData;
  onPressLink: (url: string) => void;
  participants: ParticipantsData[];
}

const MAX_MESSAGE_LENGTH = 200;

const MessageMark = ({
  user,
  message,
  onPressLink,
  participants,
}: MessageMarkProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const isRight = message.author?.id === user?.id;
  const rawText = message.message || "";
  const isLongMessage = rawText.length > MAX_MESSAGE_LENGTH;

  const processMentionsToMarkdown = useCallback(
    (text: string) => {
      if (!text) return "";
      
      return text.replace(/@(\w+)/g, (match, nickname) => {
        const participant = participants?.find(
          (p) => p.user?.nickname === nickname
        );

        if (participant?.user?.id) {
          return `[${match}](mention://${participant.user.id})`;
        }
        return match;
      });
    },
    [participants]
  );

  const displayedText = useMemo(() => {
    let textToDisplay = rawText;
    if (isLongMessage && !isExpanded) {
      textToDisplay = `${rawText.substring(0, MAX_MESSAGE_LENGTH)}... `;
    }
    return processMentionsToMarkdown(textToDisplay);
  }, [rawText, isLongMessage, isExpanded, processMentionsToMarkdown]);

  const copyLink = useCallback(async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Erro ao copiar link:", err);
    }
  }, []);

  return (
    <MessageMarkdownContainer $isRight={isRight}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <MessageContent $isRight={isRight}>{children}</MessageContent>
          ),
          h2: ({ children }) => (
            <MessageContent $isRight={isRight}>{children}</MessageContent>
          ),
          h3: ({ children }) => (
            <MessageContent $isRight={isRight}>{children}</MessageContent>
          ),
          h4: ({ children }) => (
            <MessageContent $isRight={isRight}>{children}</MessageContent>
          ),
          h5: ({ children }) => (
            <MessageContent $isRight={isRight}>{children}</MessageContent>
          ),
          h6: ({ children }) => (
            <MessageContent $isRight={isRight}>{children}</MessageContent>
          ),
          p: ({ children }) => (
            <MessageContent $isRight={isRight}>{children}</MessageContent>
          ),
          a: ({ href, children }) => {
            if (href?.startsWith("mention://")) {
              const userId = href.replace("mention://", "");
              return (
                <MessageLink
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user-profile/${userId}`);
                  }}
                >
                  {children}
                </MessageLink>
              );
            }

            return (
              <MessageLink
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  if (href) onPressLink(href);
                }}
                onContextMenu={(e) => {
                  if (href) copyLink(e, href);
                }}
              >
                {children}
              </MessageLink>
            );
          },
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return <MessageCodeInline>{children}</MessageCodeInline>;
            }
            return (
              <MessageCodeBlock>
                <MessageCodeBlockText>{children}</MessageCodeBlockText>
              </MessageCodeBlock>
            );
          },
        }}
      >
        {displayedText}
      </ReactMarkdown>

      {isLongMessage && (
        <ExpandButton
          onClick={() => setIsExpanded(!isExpanded)}
          $isRight={isRight}
        >
          {isExpanded ? "Ler menos" : "Ler mais"}
        </ExpandButton>
      )}
    </MessageMarkdownContainer>
  );
};

export default memo(MessageMark, (prev, next) => {
  return (
    prev.message.id === next.message.id &&
    prev.message.message === next.message.message
  );
});