import React from "react";
import Sidebar from "~/components/Sidebar";

import {
  Container,
  GroupsContainer,
  GroupsTitle,
  MainContainer,
  QuickAccessGroup,
  QuickAccessGroupsContainer,
  QuickAccessGroupsScroll,
  QuickAccessTitle,
} from "./styles";

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
        </GroupsContainer>
      </Container>
    </MainContainer>
  );
};

export default Home;
