import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/PublicRoute.tsx", [
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
  ]),
  layout("routes/ProtectedRoute.tsx", [
    route("/", "pages/Home/index.tsx", [
      // Rota padrão (quando nenhum chat está selecionado)
      index("pages/Home/components/NoChatSelected/index.tsx"),
      route("chat/:id", "pages/Chat/index.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
