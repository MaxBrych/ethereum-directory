"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import GlobalSearch from "./global-search";

/* ---------- thirdweb imports ---------- */
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { ethereum } from "thirdweb/chains";

/* ---------- thirdweb config ---------- */
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!, // <- set in .env.local
});

const wallets = [
  inAppWallet({
    auth: { options: ["google", "farcaster", "email", "x", "phone"] },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("org.uniswap"),
  createWallet("com.trustwallet.app"),
  createWallet("com.okex.wallet"),
  createWallet("com.binance.wallet"),
  createWallet("com.bitget.web3"),
];

interface MainHeaderProps {
  backHref?: string;
  type?: string;
}

export default function MainHeader({ backHref, type }: MainHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  /* shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const placeholder = type ? `Search ${type}s…` : "Search Ethereum tools…";

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-200 ${
        scrolled
          ? "border-neutral-800 bg-black/80 backdrop-blur-md"
          : "border-neutral-900 bg-black"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* back button */}
        {backHref && (
          <Link
            href={backHref}
            className="mr-3 flex items-center gap-1 text-neutral-400 transition hover:text-neutral-200"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </Link>
        )}

        {/* mobile sidebar toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              document.documentElement.classList.toggle("sidebar-open")
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* spacer to keep search centered */}
        {!backHref && <div className="w-[42px] md:hidden" />}

        {/* search & wallet */}
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:block w-full max-w-md">
            <GlobalSearch placeholder={placeholder} type={type} />
          </div>

          {/* ------------ thirdweb ConnectButton ------------ */}
          <ConnectButton
            client={client}
            wallets={wallets}
            theme={darkTheme({
              colors: { modalBg: "hsl(0 0% 0%)" },
            })}
            connectButton={{ label: "Sign In" }}
            connectModal={{ size: "compact", showThirdwebBranding: false }}
            accountAbstraction={{ chain: ethereum, sponsorGas: true }}
            auth={{
              async doLogin({ payload, signature }) {
                await fetch("/api/auth/login", {
                  method: "POST",
                  body: JSON.stringify({ payload, signature }),
                });
              },
              async doLogout() {
                await fetch("/api/auth/logout", { method: "POST" });
              },
              async getLoginPayload() {
                const res = await fetch("/api/auth/payload");
                return res.json();
              },
              async isLoggedIn() {
                const res = await fetch("/api/auth/me");
                return res.status === 200;
              },
            }}
          />
        </div>
      </div>

      {/* mobile search */}
      <div className="sm:hidden border-t border-neutral-800 p-3">
        <GlobalSearch placeholder={placeholder} type={type} />
      </div>
    </header>
  );
}