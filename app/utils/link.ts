import URLParse from "url-parse";
import config from "~/config";
import { ArrayUtils } from "./array";

class LinkUtils {
  isSaturnChatLink(url: string) {
    if (!url) return false;

    const { hostname } = new URLParse(url.replace("www.", ""), true);

    return config.SATURN_CHAT_DOMAINS.includes(hostname);
  }

  hasSaturnChatDeepLinkInApp(path: string | null) {
    if (!path) return false;
    const arrayUtils = new ArrayUtils();
    const paths = ["invite"];
    const separatedPath = (
      path.split("/").filter(Boolean).shift() ?? ""
    ).toLowerCase();

    return arrayUtils.has(paths, (p) => separatedPath === p);
  }

  getAllLinksFromText(text: string) {
    if (!text) {
      return [];
    }

    return (text.match(
      /\b((https?):\/\/|(www)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/gi,
    ) || []) as string[];
  }

  isInviteLink(host: string, pathname: string) {
    if (!config.SATURN_CHAT_DOMAINS.includes(host)) return { isInvite: false };
    if (!pathname) return { isInvite: false };

    const partsOfPath = pathname.split("/").filter(Boolean);

    if (partsOfPath.includes("invite")) {
      if (partsOfPath.length !== 2) return { isInvite: false };

      return { isInvite: true, inviteID: partsOfPath.pop() };
    }

    return { isInvite: false };
  }

  async openLink(url: string, navigate?: (path: string) => void) {
    if (!url) return;

    const formattedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const isSaturnChatLink = this.isSaturnChatLink(formattedUrl);

    if (isSaturnChatLink) {
      const parsed = new URLParse(formattedUrl, true);
      const pathname = parsed.pathname;

      if (pathname && this.hasSaturnChatDeepLinkInApp(pathname)) {
        if (navigate) {
          navigate(pathname + (parsed.query ? `?${parsed.query}` : ""));
          return;
        }

        window.location.href =
          pathname + (parsed.query ? `?${parsed.query}` : "");
        return;
      }
    }

    try {
      window.open(formattedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Erro ao abrir o link:", error);
      window.location.href = formattedUrl;
    }
  }
}

export { LinkUtils };
