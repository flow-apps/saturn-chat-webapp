import Home from "~/pages/Home";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Grupos" },
    { name: "description", content: "Converse em grupo com seus amigos" },
  ];
}

export default function HomePage() {
  return <Home />;
}
