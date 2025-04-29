"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import NewsletterSubscription from "./newsletter-subscription"

interface Tag {
  id: number
  name: string
}

export default function Hero({ tags }: { tags: Tag[] }) {
  const [visibleTags, setVisibleTags] = useState<Tag[]>([])

  useEffect(() => {
    if (tags.length === 0) return

    // Randomly select 15 tags to display initially
    const shuffled = [...tags].sort(() => 0.5 - Math.random())
    setVisibleTags(shuffled.slice(0, Math.min(15, tags.length)))

    // Rotate tags every 3 seconds
    const interval = setInterval(() => {
      setVisibleTags((prev) => {
        const shuffled = [...tags].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, Math.min(15, tags.length))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [tags])

  return (
    <div className="relative overflow-hidden py-20 px-6 md:px-10 lg:px-16">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg-image.png"
          alt="Ethereum Network"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 to-neutral-950/90"></div>
      </div>

      {/* Background gradient rings - reduced opacity to blend with the image */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-600/10 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-purple-600/10 to-indigo-500/10 blur-3xl"></div>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">All Ethereum tools in one place</h1>
        <p className="text-xl text-neutral-300 mb-8">
          Discover the best wallets, dApps, learning resources, services, and events in the Ethereum ecosystem
        </p>

        <NewsletterSubscription />

        {/* Animated tag pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <AnimatePresence mode="popLayout">
            {visibleTags.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-neutral-800/80 backdrop-blur-sm text-neutral-100 px-4 py-2 rounded-full text-sm"
              >
                <Link href={`/?tag=${tag.id}`}>{tag.name}</Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
