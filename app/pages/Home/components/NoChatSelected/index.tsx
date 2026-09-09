// pages/Home/components/NoChatSelected/index.tsx
import React from "react";
import styled from "styled-components";
import { MessageSquare } from "lucide-react";

const EmptyStateContainer = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.dark_heading || "#a1a1aa"};
  gap: 12px;
`;

export const NoChatSelected: React.FC = () => {
  return (
    <EmptyStateContainer>
      <MessageSquare size={48} strokeWidth={1.5} />
      <h3>Selecione um grupo para começar a conversar</h3>
    </EmptyStateContainer>
  );
};

export default NoChatSelected;