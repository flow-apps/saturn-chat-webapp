import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router";
import _ from "lodash";

import Sidebar from "~/components/Sidebar";
import Group from "../Home/components/Group";
import api from "~/services/api";
import { useAuth } from "~/contexts/auth";
import { FriendData } from "~/types/interfaces";
import { getFriendAvatar, getFriendID, getFriendName } from "~/utils/friends";

import {
  Container,
  FriendsContainer,
  FriendsListContainer,
  FriendsTitle,
  FriendsSubtitle,
  MainContainer,
  QuickAccessFriendsContainer,
  QuickAccessFriendsScroll,
  QuickAccessTitle,
  QuickAccessFriend,
  FriendHasMessageBadge,
  EmptyContainer,
  EmptyTitle,
  EmptySubtitle,
} from "./styles";
import Loading from "~/components/Loading";

export const Friends: React.FC = () => {
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  const loadFriends = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/friends");

      if (response.status === 200) {
        const friendsData = response.data as FriendData[];
        const sortedFriends = _.orderBy(
          friendsData,
          ["unreadMessagesAmount"],
          ["desc"],
        );

        setFriends(sortedFriends);
      }
    } catch (error) {
      console.error("Erro ao carregar amigos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleGoChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <MainContainer>
      <Sidebar />

      <Container>
        <FriendsContainer>
          <FriendsTitle>Amigos</FriendsTitle>
          <FriendsSubtitle>
            {friends.length === 1
              ? "1 amigo ativo"
              : `${friends.length} amigos ativos`}
          </FriendsSubtitle>

          {/* ACESSO RÁPIDO DE AMIGOS */}
          <QuickAccessFriendsContainer>
            <QuickAccessTitle>Acesso Rápido</QuickAccessTitle>
            <QuickAccessFriendsScroll>
              {friends.map((item) => {
                const friendName = getFriendName(user?.id, item);
                const avatarUrl = getFriendAvatar(user?.id, item);

                return (
                  <QuickAccessFriend
                    key={item.id}
                    to={`/friends/chat/${item.chat.id}`}
                    title={friendName}
                  >
                    <img
                      src={avatarUrl || "/avatar-placeholder.jpg"}
                      alt={friendName}
                    />
                    {Number(item?.unreadMessagesAmount) > 0 && (
                      <FriendHasMessageBadge />
                    )}
                  </QuickAccessFriend>
                );
              })}
            </QuickAccessFriendsScroll>
          </QuickAccessFriendsContainer>

          {/* LISTA PRINCIPAL DE AMIGOS */}
          <FriendsListContainer>
            {friends.length === 0 ? (
              <EmptyContainer>
                <EmptyTitle>Nenhum amigo encontrado</EmptyTitle>
                <EmptySubtitle>
                  Você ainda não possui conversas privadas iniciadas.
                </EmptySubtitle>
              </EmptyContainer>
            ) : (
              friends.map((item) => {
                const friendName = getFriendName(user?.id, item);
                const avatarUrl = getFriendAvatar(user?.id, item);

                return (
                  <Group
                    key={item.id}
                    name={friendName}
                    image={avatarUrl || "/avatar-placeholder.jpg"}
                    unreadMessages={item?.unreadMessagesAmount}
                    onClick={() => {
                      navigate(`/friends/chat/${item.chat.id}`);
                    }}
                  />
                );
              })
            )}
          </FriendsListContainer>
        </FriendsContainer>

        {/* Área central onde renderiza o Chat ativo selecionado */}
        <Outlet />
      </Container>
    </MainContainer>
  );
};

export default Friends;
