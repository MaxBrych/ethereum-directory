"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import ErrorMessage from "./error-message"

interface Tag {
  id: number
  name: string
}

interface FacetSidebarProps {
  tags: Tag[]
  selectedTags: number[]
  type: string
  error: string | null
}

export default function FacetSidebar({ tags, selectedTags, type, error }: FacetSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useMobile()
  const [selected, setSelected] = useState<number[]>(selectedTags)

  const handleTagChange = (tagId: number, checked: boolean) => {
    let newSelected: number[]

    if (checked) {
      newSelected = [...selected, tagId]
    } else {
      newSelected = selected.filter((id) => id !== tagId)
    }

    setSelected(newSelected)

    const params = new URLSearchParams(searchParams.toString())

    if (newSelected.length > 0) {
      params.set("tag", newSelected.join(","))
    } else {
      params.delete("tag")
    }

    router.push(`/${type}?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelected([])

    const params = new URLSearchParams(searchParams.toString())
    params.delete("tag")

    if (params.has("q")) {
      router.push(`/${type}?${params.toString()}`)
    } else {
      router.push(`/${type}`)
    }
  }

  const sidebar = (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filter by Tags</h3>
        {selected.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-neutral-400 hover:text-neutral-100">
            Clear filters
          </Button>
        )}
      </div>

      {error ? (
        <ErrorMessage title="Failed to load tags" message={error} />
      ) : tags.length > 0 ? (
        <div className="space-y-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={selected.includes(tag.id)}
                onCheckedChange={(checked) => handleTagChange(tag.id, checked === true)}
              />
              <label
                htmlFor={`tag-${tag.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag.name}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-neutral-400 text-sm">No tags available.</div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="mb-4">
            Filter by Tags {selected.length > 0 && `(${selected.length})`}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] bg-neutral-900 border-neutral-800">
          {sidebar}
        </SheetContent>
      </Sheet>
    )
  }

  return <div className="w-64 pr-6 border-r border-neutral-800">{sidebar}</div>
}
