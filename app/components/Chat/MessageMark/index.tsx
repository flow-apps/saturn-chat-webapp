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

  const displayedText = useMemo(() => {
    if (!isLongMessage || isExpanded) return rawText;
    return `${rawText.substring(0, MAX_MESSAGE_LENGTH)}... `;
  }, [rawText, isLongMessage, isExpanded]);

  const copyLink = useCallback(async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Erro ao copiar link:", err);
    }
  }, []);

  // Processa menções (@username) no texto antes de passar para o Markdown
  const renderTextWithMentions = useCallback(
    (text: string) => {
      const mentionRegex = /(@\w+)/g;
      if (!mentionRegex.test(text)) return text;

      const parts = text.split(mentionRegex);
      return parts.map((part, index) => {
        if (part.startsWith("@")) {
          const nickname = part.substring(1);
          const participant = participants?.find(
            (p) => p.user?.nickname === nickname
          );

          if (participant?.user?.id) {
            return (
              <MessageLink
                key={`mention-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user-profile/${participant.user.id}`);
                }}
              >
                {part}
              </MessageLink>
            );
          }
        }
        return part;
      });
    },
    [participants, navigate]
  );

  return (
    <MessageMarkdownContainer $isRight={isRight}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <MessageContent $isRight={isRight}>{children}</MessageContent>
          ),
          a: ({ href, children }) => (
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
          ),
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
          text: ({ children }) => {
            if (typeof children === "string") {
              return <>{renderTextWithMentions(children)}</>;
            }
            return <>{children}</>;
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