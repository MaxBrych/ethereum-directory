import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies, headers } from "next/headers"
import { ThemeProvider } from "@/components/theme-provider"
import SupabaseProvider from "@/components/supabase-provider"
import MainHeader from "@/components/main-header"
import SidebarNav from "@/components/sidebar-nav"
import ThirdwebProvider from "@/components/thirdweb-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ethereum Directory",
  description: "All Ethereum tools in one place",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseClient = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await baseClient.auth.getSession()
 
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-neutral-950 text-neutral-100 min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <SupabaseProvider>
            <ThirdwebProvider>
            <div className="flex min-h-screen">
              <SidebarNav session={session} />
              <div className="flex-1 flex flex-col ml-64">
              <MainHeader />
                <main className="flex-1">{children}</main>
              </div>
            </div>
            </ThirdwebProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
