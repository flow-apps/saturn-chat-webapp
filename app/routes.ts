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
    route("/", "routes/home.tsx", [
      index("pages/Home/components/NoChatSelected/index.tsx"),
      route("chat/:id", "pages/Chat/index.tsx"),
    ]),

    route("friends", "routes/friends.tsx", [
      index("pages/Home/components/NoChatSelected/index.tsx", {
        id: "friends-no-chat",
      }),
      route("chat/:id", "pages/Chat/index.tsx", { id: "friends-chat" }),
    ]),
  ]),
] satisfies RouteConfig;