import type { Route } from "./+types/home";
import Login from "~/pages/Auth/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Page" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function LoginPage() {
  return <Login />;
}
