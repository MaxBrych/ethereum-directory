"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Option {
  value: number
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: Option[]
  onChange: (selected: Option[]) => void
}

export function MultiSelect({ options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: Option) => {
    const isSelected = selected.some((item) => item.value === option.value)

    if (isSelected) {
      onChange(selected.filter((item) => item.value !== option.value))
    } else {
      onChange([...selected, option])
    }
  }

  const handleRemove = (option: Option) => {
    onChange(selected.filter((item) => item.value !== option.value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((option) => (
                <Badge key={option.value} variant="secondary" className="mr-1 mb-1">
                  {option.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(option)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleRemove(option)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-neutral-500">Select tags...</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => {
                const isSelected = selected.some((item) => item.value === option.value)

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                        isSelected ? "bg-primary border-primary" : "opacity-50 border-neutral-700"
                      }`}
                    >
                      {isSelected && <span className="h-2 w-2 bg-white rounded-sm" />}
                    </div>
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
