"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import useSupabaseBrowser from "@/lib/useSupabaseBrowser"

export default function NewsletterSubscription({ variant = "hero" }: { variant?: "hero" | "banner" }) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = useSupabaseBrowser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Insert email into the subscriptions table
      const { error } = await supabase.from("email_subscriptions").insert({ email })

      if (error) {
        if (error.code === "23505") {
          // Unique violation
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter",
        })
        setEmail("")
      }
    } catch (error) {
      console.error("Error subscribing:", error)
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "banner") {
    return (
      <div className="w-full bg-gradient-to-r from-white to-gray-90 rounded-xl overflow-hidden">
        
        <div className="px-6 py-8 md:py-10 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">All the Tools You Need in one place.</h2>
            <p className="text-neutral-300">Tools, Resources & Products. Delivered weekly</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/30 border-neutral-700 min-w-[240px]"
            />
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-8 mb-12">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-black/30 border-neutral-700"
        />
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      <div className="mt-3 text-center">
        <p className="text-sm text-neutral-400">Join 3700+ Ethereum enthusiasts. Get weekly updates.</p>
      </div>
    </div>
  )
}
