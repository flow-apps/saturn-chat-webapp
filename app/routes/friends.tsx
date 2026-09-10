import type { Route } from "./+types/home";
import Friends from "~/pages/Friends";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Amigos" },
    {
      name: "description",
      content:
        "Quer mais privacidade? Mande mensagens diretamente aos seus amigos",
    },
  ];
}

export default function FriendsPage() {
  return <Friends />;
}
