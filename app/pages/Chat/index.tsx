import React from "react";
import { useParams } from "react-router";
import styled from "styled-components";

const ChatContainer = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: #ffffff;
`;

const Chat: React.FC = () => {
  const { id } = useParams();

  return (
    <ChatContainer>
      <h2>Conversa do Grupo #{id}</h2>
    </ChatContainer>
  );
};

export default Chat;
