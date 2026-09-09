import React from "react";
import Sidebar from "~/components/Sidebar";

import {
  Container,
  GroupsContainer,
  GroupsListContainer,
  GroupsTitle,
  MainContainer,
  QuickAccessGroup,
  QuickAccessGroupsContainer,
  QuickAccessGroupsScroll,
  QuickAccessTitle,
} from "./styles";
import Group from "./components/Group";

const Home: React.FC = () => {
  return (
    <MainContainer>
      <Sidebar />
      <Container>
        <GroupsContainer>
          <GroupsTitle>Grupos</GroupsTitle>
          <QuickAccessGroupsContainer>
            <QuickAccessTitle>Acesso Rápido</QuickAccessTitle>
            <QuickAccessGroupsScroll>
              <QuickAccessGroup to={"/chat/124"}>
                <img src="/avatar-placeholder.jpg" />
              </QuickAccessGroup>
              <QuickAccessGroup to={"/chat/124"}>
                <img src="/avatar-placeholder.jpg" />
              </QuickAccessGroup>
              <QuickAccessGroup to={"/chat/124"}>
                <img src="/avatar-placeholder.jpg" />
              </QuickAccessGroup>
              <QuickAccessGroup to={"/chat/124"}>
                <img src="/avatar-placeholder.jpg" />
              </QuickAccessGroup>
              <QuickAccessGroup to={"/chat/124"}>
                <img src="/avatar-placeholder.jpg" />
              </QuickAccessGroup>
              <QuickAccessGroup to={"/chat/124"}>
                <img src="/avatar-placeholder.jpg" />
              </QuickAccessGroup>
            </QuickAccessGroupsScroll>
          </QuickAccessGroupsContainer>

          <GroupsListContainer>
            <Group
              name={"Teste"}
              image={"/avatar-placeholder.jpg"}
              unreadMessages={99}
              // onClick={() => handleGoChat(item.id)}
            />
            <Group
              name={"Teste"}
              image={"/avatar-placeholder.jpg"}
              unreadMessages={99}
              // onClick={() => handleGoChat(item.id)}
            />
            <Group
              name={"Teste"}
              image={"/avatar-placeholder.jpg"}
              unreadMessages={99}
              // onClick={() => handleGoChat(item.id)}
            />
            <Group
              name={"Teste"}
              image={"/avatar-placeholder.jpg"}
              unreadMessages={99}
              // onClick={() => handleGoChat(item.id)}
            />
            <Group
              name={"Teste"}
              image={"/avatar-placeholder.jpg"}
              unreadMessages={99}
              // onClick={() => handleGoChat(item.id)}
            />
            <Group
              name={"Teste"}
              image={"/avatar-placeholder.jpg"}
              unreadMessages={99}
              // onClick={() => handleGoChat(item.id)}
            />
            <Group
              name={"Teste"}
              image={"/avatar-placeholder.jpg"}
              unreadMessages={99}
              // onClick={() => handleGoChat(item.id)}
            />
            <Group
              name={"Teste"}
              image={"/avatar-placeholder.jpg"}
              unreadMessages={99}
              // onClick={() => handleGoChat(item.id)}
            />
            <Group
              name={"Teste"}
              image={"/avatar-placeholder.jpg"}
              unreadMessages={99}
              // onClick={() => handleGoChat(item.id)}
            />
          </GroupsListContainer>
        </GroupsContainer>
      </Container>
    </MainContainer>
  );
};

export default Home;
