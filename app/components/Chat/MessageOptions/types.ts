import { ParticipantRoles } from "~/types/enums";
import { GroupData, MessageData } from "~/types/interfaces";

export interface IOptions {
  content: string;
  action: () => unknown;
  onlyOwner: boolean;
  showInDM: boolean;
  iconName?: string;
  color?: string;
  authorizedRoles: ParticipantRoles[] | string[];
  showForAuthor?: boolean;
}

export interface IMessageOptionsProps {
  visible: boolean;
  message: MessageData;
  options: IOptions[];
  participant_role: ParticipantRoles;
  close: () => void;
  group: GroupData;
}