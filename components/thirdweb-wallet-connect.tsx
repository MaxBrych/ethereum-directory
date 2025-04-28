"use client"

import { createThirdwebClient } from "thirdweb"
import { ConnectButton } from "thirdweb/react"
import { darkTheme } from "thirdweb/react"
import { inAppWallet, createWallet } from "thirdweb/wallets"
import { ethereum } from "thirdweb/chains"

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
})

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "farcaster", "email", "x", "phone"],
    },
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
]

export default function ThirdwebWalletConnect() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme={darkTheme({
        colors: { modalBg: "hsl(0, 0%, 0%)" },
      })}
      connectButton={{
        label: "Connect Wallet",
        className: "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md",
      }}
      connectModal={{ size: "compact", showThirdwebBranding: false }}
      accountAbstraction={{
        chain: ethereum,
        sponsorGas: true,
      }}
      auth={{
        async doLogin(params) {
          // call your backend to verify the signed payload passed in params
          console.log("Login params:", params)
        },
        async doLogout() {
          // call your backend to logout the user if needed
          console.log("Logout")
        },
        async getLoginPayload(params) {
          // call your backend and return the payload
          return { payload: "Login to Ethereum Directory" }
        },
        async isLoggedIn() {
          // call your backend to check if the user is logged in
          return false
        },
      }}
    />
  )
}
