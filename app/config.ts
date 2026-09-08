const configs = {
  PROD_API_URL: "https://saturnchat.azurewebsites.net/",
  DEV_API_URL: "http://localhost:3000",
  STORAGE_URL: "https://saturnchatstorage.blob.core.windows.net/",
  SATURN_CHAT_DOMAINS: ["saturn-chat.vercel.app", "saturnchat.com.br"],
  WEBSITE_URL: "https://saturnchat.com.br",
  OFICIAL_GROUP_ID: "d10dfadb-08d1-4eb8-8a82-3a7b379604d3",
  ICE_SERVERS_CONFIG: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      // {
      //   urls: secrets.TURN.url,
      //   username: secrets.TURN.username,
      //   credential: secrets.TURN.password,
      // },
    ],
  },
  ADS: {
    TEST_ADS_IDS: {
      BANNER: "ca-app-pub-3940256099942544/2934735716",
      INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
    },
  },
};

export default configs;
