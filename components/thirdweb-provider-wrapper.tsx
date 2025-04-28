"use client"

import type React from "react"
import { ThirdwebProvider } from "@thirdweb-dev/react"
import { Ethereum } from "@thirdweb-dev/chains"

export default function ThirdwebProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider activeChain={Ethereum} clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ""}>
      {children}
    </ThirdwebProvider>
  )
}
