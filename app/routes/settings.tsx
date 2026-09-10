import Settings from "~/pages/Settings";
import type { Route } from "./+types/home";
import Login from "~/pages/Auth/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Page" },
    { name: "description", content: "Acesse sua conta" },
  ];
}

export default function SettingsPage() {
  return <Settings />;
}
