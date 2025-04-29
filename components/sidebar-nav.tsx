"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Session } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import {
  Home,
  Wallet,
  AppWindow,
  BookOpen,
  Briefcase,
  Calendar,
  PlusCircle,
  Settings,
  X,
  ChevronDown,
  Film,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface SidebarNavProps {
  session: Session | null
}

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  children?: { name: string; href: string }[]
}

export default function SidebarNav({ session }: SidebarNavProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  // Handle mobile sidebar toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        document.documentElement.classList.remove("sidebar-open")
        setIsMobileOpen(false)
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

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  const navItems: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Wallets", href: "/wallet", icon: Wallet },
    { name: "dApps", href: "/dapp", icon: AppWindow },
    {
      name: "Learning",
      href: "/learning",
      icon: BookOpen,
      children: [
        { name: "Articles", href: "/learning/articles" },
        { name: "Books", href: "/learning/books" },
        { name: "Tutorials", href: "/learning/tutorials" },
      ],
    },
    {
      name: "Media",
      href: "/media",
      icon: Film,
      children: [
        { name: "Podcasts", href: "/media/podcasts" },
        { name: "Videos", href: "/media/videos" },
        { name: "Documentaries", href: "/media/documentaries" },
      ],
    },
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
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-800 bg-neutral-950 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Close button for mobile */}
        <button
          className="absolute right-4 top-4 md:hidden"
          onClick={() => document.documentElement.classList.remove("sidebar-open")}
        >
          <X size={20} />
        </button>

        <div className="p-5">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
            <span className="text-lg font-semibold">Ethereum Directory</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              const hasChildren = item.children && item.children.length > 0
              const isExpanded = expandedItems[item.name]

              return (
                <li key={item.href} className="text-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {hasChildren ? (
                        <button
                          onClick={() => toggleExpand(item.name)}
                          className={cn(
                            "flex items-center justify-between w-full rounded-md px-3 py-2 transition-all hover:bg-neutral-800",
                            isActive ? "bg-neutral-800 text-white" : "text-neutral-400",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={16} />
                            <span>{item.name}</span>
                          </div>
                          <ChevronDown
                            size={14}
                            className={cn("transition-transform duration-200", isExpanded ? "rotate-180" : "")}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:bg-neutral-800 w-full",
                            isActive ? "bg-neutral-800 text-white" : "text-neutral-400",
                          )}
                        >
                          <Icon size={16} />
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </div>

                    {/* Children items */}
                    {hasChildren && isExpanded && (
                      <ul className="ml-7 mt-1 space-y-0.5">
                        {item.children?.map((child) => {
                          const childIsActive = pathname === child.href || pathname.startsWith(child.href)
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "block rounded-md px-3 py-1.5 transition-all hover:bg-neutral-800",
                                  childIsActive ? "text-white" : "text-neutral-400",
                                )}
                              >
                                {child.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-auto p-3 border-t border-neutral-800">
          <Link href="/submit">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 justify-start text-sm font-normal bg-transparent hover:bg-neutral-800 text-white"
            >
              <div className="relative">
                <PlusCircle size={16} />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <span>Submit a Listing</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
