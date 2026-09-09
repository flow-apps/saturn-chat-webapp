import React from "react";
import Sidebar from "~/components/Sidebar";

import {
  Container,
  GroupsContainer,
  GroupsTitle,
  MainContainer,
} from "./styles";

const Home: React.FC = () => {
  return (
    <MainContainer>
      <Sidebar />
      <Container>
        <GroupsContainer>
          <GroupsTitle>Grupos</GroupsTitle>
        </GroupsContainer>
      </Container>
    </MainContainer>
  );
};

export default Home;
