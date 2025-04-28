"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface VoteButtonProps {
  listingId: string
  votes: number
  hasVoted?: boolean
}

export default function VoteButton({ listingId, votes = 0, hasVoted = false }: VoteButtonProps) {
  const [loading, setLoading] = useState(false)
  const [voted, setVoted] = useState(hasVoted)
  const [voteCount, setVoteCount] = useState(votes)
  const router = useRouter()
  // Create the client without chaining the schema method initially
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      })
      return
    }

    if (voted) return

    setLoading(true)

    try {
      // Apply the schema when making the query
      const { error } = await supabase.schema("ethdir").from("votes").insert({ listing_id: listingId })

      if (error) throw error

      setVoted(true)
      setVoteCount((prev) => prev + 1)

      toast({
        title: "Vote recorded",
        description: "Thank you for your vote!",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={voted ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-1 ${voted ? "bg-indigo-600 hover:bg-indigo-700" : "bg-neutral-800 hover:bg-neutral-700"}`}
            onClick={handleVote}
            disabled={loading || voted}
          >
            <ThumbsUp size={14} className={voted ? "fill-white" : ""} />
            <span>{voteCount}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{voted ? "You voted for this listing" : "Vote for this listing"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
