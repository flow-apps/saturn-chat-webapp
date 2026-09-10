import Register from "~/pages/Auth/Register";
import type { Route } from "./+types/home";
import Login from "~/pages/Auth/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Faça seu cadastro" },
    {
      name: "description",
      content:
        "Que bom ver você por aqui! Vamos iniciar essa jornada pelo universo? Basta criar sua conta para começar",
    },
  ];
}

export default function RegisterPage() {
  return <Register />;
}
