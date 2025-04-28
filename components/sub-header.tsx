"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Tag {
  id: number
  name: string
}

interface SubHeaderProps {
  tags: Tag[]
  selectedTags: number[]
  type: string
}

export default function SubHeader({ tags, selectedTags, type }: SubHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTagClick = (tagId: number) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentTags = params.get("tag") ? params.get("tag")!.split(",").map(Number) : []

    // If tag is already selected, remove it
    if (currentTags.includes(tagId)) {
      const newTags = currentTags.filter((id) => id !== tagId)
      if (newTags.length > 0) {
        params.set("tag", newTags.join(","))
      } else {
        params.delete("tag")
      }
    }
    // Otherwise, add it
    else {
      params.set("tag", [...currentTags, tagId].join(","))
    }

    router.push(`/${type}?${params.toString()}`)
  }

  const clearAllTags = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("tag")
    router.push(`/${type}?${params.toString()}`)
  }

  // Get the selected tag objects
  const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id))

  if (selectedTagObjects.length === 0) return null

  return (
    <div
      className={`w-full border-b border-neutral-800 ${isScrolled ? "sticky top-16 z-40 bg-black/80 backdrop-blur-md" : "bg-black"} transition-all duration-200`}
    >
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-400 mr-2">Filtered by:</span>

        {selectedTagObjects.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="bg-indigo-900/30 hover:bg-indigo-800/50 text-indigo-300 border-indigo-800 cursor-pointer flex items-center gap-1 px-3 py-1"
            onClick={() => handleTagClick(tag.id)}
          >
            {tag.name}
            <X size={14} className="ml-1" />
          </Badge>
        ))}

        {selectedTagObjects.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-neutral-400 hover:text-white ml-auto"
            onClick={clearAllTags}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}
