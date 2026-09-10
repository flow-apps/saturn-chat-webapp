import type { Route } from "./+types/home";
import Friends from "~/pages/Friends";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Amigos" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function FriendsPage() {
  return <Friends />;
}
