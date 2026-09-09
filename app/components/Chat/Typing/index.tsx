import React, { memo } from "react";
import { Lottie } from "lottie-react";
import typingAnimationData from "~/assets/typing.json";
import { UserData } from "~/types/interfaces";

import {
  Container,
  TypingContainer,
  TypingLeftSide,
  TypingRightSide,
  TypingUsersContainer,
  TypingUsersText,
} from "./styles";

type TypingProps = {
  typingUsers: UserData[];
};

const Typing = ({ typingUsers }: TypingProps) => {
  if (!typingUsers || typingUsers.length <= 0) return null;

  const names = [...new Set(typingUsers.map((user) => user.name))];
  const joinedNames = names.join(", ");

  const renderTypingText = () => {
    const isSingle = names.length === 1;
    const isMany = names.length >= 5;

    if (isMany) {
      return "Muitas pessoas estão digitando...";
    }

    if (isSingle) {
      return `${joinedNames} está digitando...`;
    }

    return `${joinedNames} estão digitando...`;
  };

  return (
    <Container>
      <TypingContainer>
        <TypingLeftSide>
          <Lottie src={typingAnimationData as object} loop autoplay />
        </TypingLeftSide>
        <TypingRightSide>
          <TypingUsersContainer>
            <TypingUsersText title={joinedNames}>
              {renderTypingText()}
            </TypingUsersText>
          </TypingUsersContainer>
        </TypingRightSide>
      </TypingContainer>
    </Container>
  );
};

export default memo(Typing);
