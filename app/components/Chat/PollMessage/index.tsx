import React, { memo, useCallback, useMemo } from "react";
import { CheckCircle2, Circle, Square } from "lucide-react";
import { useAuth } from "~/contexts/auth";
import { useWebsocket } from "~/contexts/websocket";
import { PollData } from "~/types/interfaces";

import {
  Container,
  QuestionText,
  SubtitleText,
  OptionsContainer,
  OptionButton,
  ProgressBar,
  OptionContent,
  OptionInfo,
  OptionText,
  PercentageText,
  TotalVotesText,
} from "./styles";

export interface PollOptionData {
  id: string;
  option_text: string;
  votes_count: number;
}

interface PollMessageProps {
  poll: PollData;
  groupId: string;
}

export const PollMessage: React.FC<PollMessageProps> = memo(
  ({ poll, groupId }) => {
    const { user } = useAuth();
    const { socket } = useWebsocket();

    const totalVotes = useMemo(() => {
      return poll.options.reduce(
        (acc, curr) => acc + (curr.votes_count || 0),
        0
      );
    }, [poll.options]);

    const handleVote = useCallback(
      (optionId: string) => {
        if (!user || !socket) return;

        const payload = {
          poll_id: poll.id,
          option_id: optionId,
          group_id: groupId,
        };

        if (socket.connected) {
          socket.emit("vote_poll", payload);
          return;
        }

        console.log(
          "Socket desconectado ao votar. Tentando reconectar e emitir..."
        );
        socket.connect();

        const onConnectOnce = () => {
          socket.emit("vote_poll", payload);
          socket.off("connect", onConnectOnce);
        };

        socket.on("connect", onConnectOnce);

        setTimeout(() => {
          socket.off("connect", onConnectOnce);
        }, 5000);
      },
      [socket, user, poll.id, groupId]
    );

    const userVotedOptionIds = useMemo(() => {
      if (!user?.id || !poll?.options) return new Set<string>();

      const votedIds = new Set<string>();

      poll.options.forEach((option) => {
        if (option.votes?.some((v) => v.user_id === user.id)) {
          votedIds.add(option.id);
        }
      });

      return votedIds;
    }, [poll?.options, user?.id]);

    const renderIcon = (isSelected: boolean) => {
      if (isSelected) {
        return <CheckCircle2 size={18} />;
      }
      if (poll.allows_multiple) {
        return <Square size={18} />;
      }
      return <Circle size={18} />;
    };

    return (
      <Container>
        <QuestionText>📊 {poll.question}</QuestionText>

        <SubtitleText>
          {poll.allows_multiple
            ? "Selecione uma ou mais opções"
            : "Selecione uma opção"}
        </SubtitleText>

        <OptionsContainer>
          {poll.options.map((option) => {
            const votes = option.votes_count || 0;
            const percentage =
              totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            const isSelected = userVotedOptionIds.has(option.id);

            return (
              <OptionButton
                key={option.id}
                onClick={() => handleVote(option.id)}
                type="button"
              >
                <ProgressBar
                  $percentage={percentage}
                  $isSelected={isSelected}
                />

                <OptionContent>
                  <OptionInfo $isSelected={isSelected}>
                    {renderIcon(isSelected)}
                    <OptionText $isSelected={isSelected}>
                      {option.option_text}
                    </OptionText>
                  </OptionInfo>

                  <PercentageText>
                    {percentage}% ({votes})
                  </PercentageText>
                </OptionContent>
              </OptionButton>
            );
          })}
        </OptionsContainer>

        <TotalVotesText>
          {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
        </TotalVotesText>
      </Container>
    );
  }
);