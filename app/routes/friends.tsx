import type { Route } from "./+types/home";
import Friends from "~/pages/Friends";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function FriendsPage() {
  return <Friends />;
}
