import Register from "~/pages/Auth/Register";
import type { Route } from "./+types/home";
import Login from "~/pages/Auth/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Faça seu cadastro" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function RegisterPage() {
  return <Register />;
}
