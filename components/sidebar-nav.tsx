"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Session } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { Home, Wallet, AppWindow, BookOpen, Briefcase, Calendar, PlusCircle, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface SidebarNavProps {
  session: Session | null
}

export default function SidebarNav({ session }: SidebarNavProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Handle mobile sidebar toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        document.documentElement.classList.remove("sidebar-open")
      }
    }

    const handleSidebarToggle = () => {
      setIsMobileOpen(document.documentElement.classList.contains("sidebar-open"))
    }

    window.addEventListener("resize", handleResize)

    // Create a mutation observer to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          handleSidebarToggle()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
    }
  }, [])

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Wallets", href: "/wallet", icon: Wallet },
    { name: "dApps", href: "/dapp", icon: AppWindow },
    { name: "Learning", href: "/learning", icon: BookOpen },
    { name: "Services", href: "/service", icon: Briefcase },
    { name: "Events", href: "/event", icon: Calendar },
    { name: "Admin", href: "/admin", icon: Settings },
  ]

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => document.documentElement.classList.remove("sidebar-open")}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-800 bg-neutral-950 transition-transform duration-300 ease-in-out md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Close button for mobile */}
        <button
          className="absolute right-4 top-4 md:hidden"
          onClick={() => document.documentElement.classList.remove("sidebar-open")}
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-90 rounded-lg"></div>
            
            <span className="text-xl font-semibold">Ethereum Directory</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-neutral-800",
                      pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-400",
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <Link href="/submit">
            <Button className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
              <PlusCircle size={16} />
              <span>Submit Listing</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
