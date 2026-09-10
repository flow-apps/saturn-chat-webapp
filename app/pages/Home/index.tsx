import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router";
import { Plus, Search, Mail, User } from "lucide-react";
import _ from "lodash";

import Sidebar from "~/components/Sidebar";
import Group from "./components/Group";

import api from "~/services/api";
import { GroupData } from "~/types/interfaces";

import {
  Container,
  GroupsContainer,
  GroupsListContainer,
  GroupsTitle,
  GroupsSubtitle,
  MainContainer,
  NewGroupButton,
  QuickAccessGroup,
  QuickAccessGroupsContainer,
  QuickAccessGroupsScroll,
  QuickAccessTitle,
  GroupHasMessageBadge,
  EmptyContainer,
  EmptyTitle,
  EmptySubtitle,
  EmptyLink,
} from "./styles";
import Loading from "~/components/Loading";

export const Home: React.FC = () => {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/groups/list");

      if (response.status === 200) {
        const groupsData = response.data as GroupData[];
        const sortedGroups = _.orderBy(
          groupsData,
          ["unreadMessagesAmount"],
          ["desc"],
        );

        setGroups(sortedGroups);
      }
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleGoChat = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleGoNewGroup = () => {
    navigate("/new-group");
  };

  const handleGoOfficialGroup = () => {
    navigate("/official-group-id");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <MainContainer>
      <Sidebar />

      <Container>
        <GroupsContainer>
          <GroupsTitle>Grupos</GroupsTitle>
          <GroupsSubtitle>
            {groups.length === 1
              ? "1 grupo ativo"
              : `${groups.length} grupos ativos`}
          </GroupsSubtitle>

          {/* ACESSO RÁPIDO */}
          <QuickAccessGroupsContainer>
            <QuickAccessTitle>Acesso Rápido</QuickAccessTitle>
            <QuickAccessGroupsScroll>
              {/* Botão de Novo Grupo */}
              <NewGroupButton onClick={handleGoNewGroup} title="Novo Grupo">
                <Plus size={28} />
              </NewGroupButton>

              {/* Lista do Acesso Rápido */}
              {groups.map((group) => (
                <QuickAccessGroup
                  key={group.id}
                  to={`/chat/${group.id}`}
                  title={group.name}
                >
                  <img
                    src={group.group_avatar?.url || "/avatar-placeholder.jpg"}
                    alt={group.name}
                  />
                  {Number(group?.unreadMessagesAmount) > 0 && (
                    <GroupHasMessageBadge />
                  )}
                </QuickAccessGroup>
              ))}
            </QuickAccessGroupsScroll>
          </QuickAccessGroupsContainer>

          {/* LISTA PRINCIPAL DE GRUPOS */}
          <GroupsListContainer>
            {groups.length === 0 ? (
              <EmptyContainer>
                <EmptyTitle>Nenhum grupo encontrado</EmptyTitle>
                <EmptySubtitle>
                  Pesquise por grupos públicos usando o ícone de busca{" "}
                  <Search size={16} style={{ display: "inline" }} /> ou entre no{" "}
                  <EmptyLink onClick={handleGoOfficialGroup}>
                    grupo oficial do Saturn Chat
                  </EmptyLink>
                  !
                </EmptySubtitle>
              </EmptyContainer>
            ) : (
              groups.map((group) => (
                <Group
                  key={group.id}
                  name={group.name}
                  image={group.group_avatar?.url || "/avatar-placeholder.jpg"}
                  unreadMessages={group?.unreadMessagesAmount}
                  onClick={() => handleGoChat(group.id)}
                />
              ))
            )}
          </GroupsListContainer>
        </GroupsContainer>

        {/* Área central onde renderiza o Chat ativo selecionado */}
        <Outlet />
      </Container>
    </MainContainer>
  );
};

export default Home;
