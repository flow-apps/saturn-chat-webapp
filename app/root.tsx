import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { AuthProvider } from "./contexts/auth";
import { ThemeControllerProvider } from "./contexts/theme";
import { WebsocketProvider } from "./contexts/websocket";
import { AudioPlayerProvider } from "./contexts/audioPlayer";
import { PurchasesProvider } from "./contexts/purchases";
import { PremiumProvider } from "./contexts/premium";
import { ChatProvider } from "./contexts/chat";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeControllerProvider>
      <AuthProvider>
        <PurchasesProvider>
          <PremiumProvider>
            <WebsocketProvider>
              <ChatProvider>
                <AudioPlayerProvider>
                  <Outlet />
                </AudioPlayerProvider>
              </ChatProvider>
            </WebsocketProvider>
          </PremiumProvider>
        </PurchasesProvider>
      </AuthProvider>
    </ThemeControllerProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Ocorreu um erro inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Erro";
    details =
      error.status === 404
        ? "A página solicitada não foi encontrada."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main style={{ padding: "32px", textAlign: "center" }}>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre
          style={{
            width: "100%",
            padding: "16px",
            overflowX: "auto",
            textAlign: "left",
            marginTop: "16px",
          }}
        >
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
