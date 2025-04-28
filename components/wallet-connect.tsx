"use client"

import { ConnectWallet } from "@thirdweb-dev/react"

export default function WalletConnect() {
  return (
    <ConnectWallet
      theme="dark"
      btnTitle="Connect Wallet"
      modalTitle="Connect Your Wallet"
      modalSize="wide"
      welcomeScreen={{
        title: "Welcome to Ethereum Directory",
        subtitle: "Connect your wallet to get started",
      }}
      className="!bg-indigo-600 hover:!bg-indigo-700 text-white px-4 py-2 rounded-md"
      style={{
        backgroundColor: "rgb(79, 70, 229)",
        borderColor: "rgb(79, 70, 229)",
      }}
    />
  )
}
