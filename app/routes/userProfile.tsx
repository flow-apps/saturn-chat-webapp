import UserProfile from "~/pages/UserProfile";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Grupos" },
    { name: "description", content: "Converse em grupo com seus amigos" },
  ];
}

export default function UserProfilePage() {
  return <UserProfile />;
}
