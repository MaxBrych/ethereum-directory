"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import SupabaseProvider from "@/components/supabase-provider"
import ThirdwebProviderWrapper from "./thirdweb-provider-wrapper"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProviderWrapper>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
        <SupabaseProvider>{children}</SupabaseProvider>
      </ThemeProvider>
    </ThirdwebProviderWrapper>
  )
}
