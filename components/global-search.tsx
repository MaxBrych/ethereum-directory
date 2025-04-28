"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"

interface GlobalSearchProps {
  placeholder?: string
  initialQuery?: string
  onSearch?: (query: string) => void
  type?: string
}

export default function GlobalSearch({
  placeholder = "Search...",
  initialQuery = "",
  onSearch,
  type,
}: GlobalSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (onSearch && debouncedQuery !== initialQuery) {
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch, initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (type) {
      // If type is provided, search within that type
      router.push(`/${type}?q=${encodeURIComponent(query)}`)
    } else {
      // Otherwise, search globally
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-neutral-900 border-neutral-700 focus:border-indigo-500 pr-20"
        />
        <Button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 bg-indigo-600 hover:bg-indigo-700"
          size="sm"
        >
          Search
        </Button>
      </div>
    </form>
  )
}
