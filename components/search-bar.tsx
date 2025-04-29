"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  type: string
}

export default function SearchBar({ type }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }

    router.push(`/${type}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
        <Input
          type="text"
          placeholder={`Search ${type}s...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-neutral-900 border-neutral-700 focus:border-white"
        />
        <Button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 bg-white hover:bg-neutral-100"
        >
          Search
        </Button>
      </div>
    </form>
  )
}
