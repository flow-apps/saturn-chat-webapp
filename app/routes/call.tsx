import Home from "~/pages/Home";
import type { Route } from "./+types/home";
import Call from "~/pages/Call";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Grupos" },
    { name: "description", content: "Converse em grupo com seus amigos" },
  ];
}

export default function CallPage() {
  return <Call />;
}
