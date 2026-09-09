import { useState, useCallback, useEffect, useRef } from "react";
import _ from "lodash";
import api from "~/services/api";
import { MessageData } from "~/types/interfaces";
import { useWebsocket } from "~/contexts/websocket";

const MESSAGES_LIMIT_REQUEST = 30;

export const useChatMessages = (groupId: string) => {
  const [oldMessages, setOldMessages] = useState<MessageData[]>([]);
  const [page, setPage] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [fetchedAll, setFetchedAll] = useState(false);

  const fetchingRef = useRef(fetching);
  fetchingRef.current = fetching;

  const fetchedAllRef = useRef(fetchedAll);
  fetchedAllRef.current = fetchedAll;

  useEffect(() => {
    setOldMessages([]);
    setPage(0);
    setFetchedAll(false);
    setFetching(false);
  }, [groupId]);

  const sortMessages = useCallback((messages: MessageData[]): MessageData[] => {
    return [...messages].sort((a, b) => {
      const dateA = a.created_at
        ? new Date(a.created_at).getTime()
        : Date.now();
      const dateB = b.created_at
        ? new Date(b.created_at).getTime()
        : Date.now();

      if (isNaN(dateA)) return -1;
      if (isNaN(dateB)) return 1;

      return dateB - dateA;
    });
  }, []);

  const fetchOldMessages = useCallback(async () => {
    if (!groupId || fetchingRef.current || fetchedAllRef.current) return;

    setFetching(true);
    try {
      const { data } = await api.get(
        `/messages/${groupId}?_page=${page}&_limit=${MESSAGES_LIMIT_REQUEST}`
      );

      if (!data.messages || data.messages.length < MESSAGES_LIMIT_REQUEST) {
        setFetchedAll(true);
      }

      if (data.messages && data.messages.length > 0) {
        setOldMessages((old) =>
          sortMessages(_.uniqBy([...old, ...data.messages], "id"))
        );
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens antigas:", error);
    } finally {
      setFetching(false);
    }
  }, [groupId, page, sortMessages]);

  const { socket } = useWebsocket();

  useEffect(() => {
    if (!socket) return;

    function handlePollVotesUpdated(data: {
      poll_id: string;
      message_id: string;
      options: Array<{ id: string; option_text: string; votes_count: number }>;
      voted_by: { user_id: string; option_id: string };
    }) {
      setOldMessages((prevMessages) => {
        const messageIndex = prevMessages.findIndex(
          (msg) => msg.id === data.message_id || msg.poll?.id === data.poll_id
        );

        if (messageIndex === -1) return prevMessages;

        const updatedMessages = [...prevMessages];
        const targetMessage = { ...updatedMessages[messageIndex] };

        if (targetMessage.poll) {
          const updatedOptions = targetMessage.poll.options.map((option) => {
            const newOptionData = data.options.find(
              (opt) => opt.id === option.id
            );
            const currentVotesCount = option.votes_count || 0;
            const newVotesCount = newOptionData
              ? newOptionData.votes_count
              : currentVotesCount;

            let updatedVotes = option.votes ? [...option.votes] : [];

            // 1. Se o número de votos diminuiu nesta opção, remove o voto do usuário
            if (newVotesCount < currentVotesCount) {
              updatedVotes = updatedVotes.filter(
                (v) => v.user_id !== data.voted_by.user_id
              );
            }
            // 2. Se o número de votos aumentou nesta opção (Voto Computado)
            else if (
              newVotesCount > currentVotesCount &&
              option.id === data.voted_by.option_id
            ) {
              const alreadyVoted = updatedVotes.some(
                (v) => v.user_id === data.voted_by.user_id
              );
              if (!alreadyVoted) {
                updatedVotes.push({
                  id: `temp_${Date.now()}`,
                  poll_id: data.poll_id,
                  option_id: option.id,
                  user_id: data.voted_by.user_id,
                  created_at: new Date().toISOString(),
                } as any);
              }
            }

            // Se for enquete de escolha única, limpa os votos das outras opções
            if (
              !targetMessage.poll?.allows_multiple &&
              option.id !== data.voted_by.option_id
            ) {
              updatedVotes = updatedVotes.filter(
                (v) => v.user_id !== data.voted_by.user_id
              );
            }

            return {
              ...option,
              votes_count: newVotesCount,
              votes: updatedVotes,
            };
          });

          targetMessage.poll = {
            ...targetMessage.poll,
            options: updatedOptions,
          };
        }

        updatedMessages[messageIndex] = targetMessage;
        return updatedMessages;
      });
    }

    socket.on("poll_votes_updated", handlePollVotesUpdated);

    return () => {
      socket.off("poll_votes_updated", handlePollVotesUpdated);
    };
  }, [socket]);

  return {
    oldMessages,
    setOldMessages,
    fetching,
    fetchedAll,
    fetchOldMessages,
    sortMessages,
    setFetchedAll,
    setPage,
  };
};