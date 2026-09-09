import { UserData } from "~/types/interfaces";

export interface MentionsProps {
  query: string;
  groupId: string;
  onUserSelect: (user: UserData) => void;
}

export interface MentionUser extends UserData {}