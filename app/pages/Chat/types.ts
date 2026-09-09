import { ParticipantRoles } from "~/types/enums";

export interface File {
  file: globalThis.File;
  type: string;
}

export interface TextInputRef extends HTMLTextAreaElement {
  value: string;
}

export const ordernedRolesArray = [
  ParticipantRoles.PARTICIPANT,
  ParticipantRoles.MODERATOR,
  ParticipantRoles.MANAGER,
  ParticipantRoles.ADMIN,
  ParticipantRoles.OWNER,
];