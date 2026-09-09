import React, { useEffect, useState } from "react";
import api from "~/services/api";
import { MentionsProps, MentionUser } from "./types";
import {
  Container,
  UserList,
  UserContainer,
  Avatar,
  Nickname,
  NoResultsText,
} from "./styles";

const Mentions: React.FC<MentionsProps> = ({
  query,
  groupId,
  onUserSelect,
}) => {
  const [users, setUsers] = useState<MentionUser[]>([]);

  useEffect(() => {
    let isMounted = true;

    if (query) {
      api
        .get(`/users/search?q=${query}&group_id=${groupId}`)
        .then((response) => {
          if (isMounted) {
            setUsers(response.data);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar usuários para menção:", error);
          if (isMounted) setUsers([]);
        });
    } else {
      setUsers([]);
    }

    return () => {
      isMounted = false;
    };
  }, [query, groupId]);

  if (!query) return null;

  return (
    <Container>
      <UserList>
        {users.length > 0 ? (
          users.map((user) => (
            <UserContainer
              key={user.id}
              onClick={() => onUserSelect(user)}
              type="button"
            >
              <Avatar
                src={user.avatar?.url || "/avatar-placeholder.jpg"}
                alt={user.nickname}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/avatar-placeholder.jpg";
                }}
              />
              <Nickname>@{user.nickname}</Nickname>
            </UserContainer>
          ))
        ) : (
          <NoResultsText>Nenhum usuário encontrado</NoResultsText>
        )}
      </UserList>
    </Container>
  );
};

export default Mentions;