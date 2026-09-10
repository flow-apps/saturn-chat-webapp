import Home from "~/pages/Home";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Grupos" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function HomePage() {
  return <Home />;
}
