"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { ethereum } from "thirdweb/chains";

export default function ThirdwebAppProvider({ children }: PropsWithChildren) {
  // Only create the QueryClient once
  const [queryClient] = useState(() => new QueryClient());

  // Define your wallet list here (same as in your header)
  const wallets = [
    inAppWallet({ auth: { options: ["google","farcaster","email","x","phone"] } }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    // … other wallets …
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!}
        supportedWallets={wallets}
        activeChain={ethereum}
        accountAbstraction={{ sponsorGas: true }}
        theme={{
          // you can still use darkTheme(...) if you prefer
          modal: { background: "hsl(0 0% 0%)" },
        }}
        authConfig={{
          doLogin: async ({ payload, signature }) => {
            await fetch("/api/auth/login", {
              method: "POST",
              body: JSON.stringify({ payload, signature }),
            });
          },
          doLogout: async () =>
            fetch("/api/auth/logout", { method: "POST" }),
          getLoginPayload: async () =>
            (await fetch("/api/auth/payload")).json(),
          isLoggedIn: async () =>
            (await fetch("/api/auth/me")).status === 200,
        }}
      >
        {children}
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}