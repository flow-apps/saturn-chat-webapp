import React, { memo, ButtonHTMLAttributes } from "react";
import {
  Container,
  GroupInfos,
  GroupName,
  UnreadMessages,
  UnreadMessagesText,
  GroupImage,
} from "./styles";

interface GroupProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  image?: string;
  unreadMessages?: number;
}

const Group = ({ name, unreadMessages = 0, image, ...rest }: GroupProps) => {
  return (
    <Container {...rest}>
      <GroupInfos>
        <GroupImage src={image || "/avatar-placeholder.jpg"} alt={name} />
        <GroupName title={name}>{name}</GroupName>
      </GroupInfos>

      {unreadMessages > 0 && (
        <UnreadMessages>
          <UnreadMessagesText>
            {unreadMessages > 99 ? "99+" : unreadMessages}
          </UnreadMessagesText>
        </UnreadMessages>
      )}
    </Container>
  );
};

export default memo(Group);
