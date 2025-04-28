import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

// Sample logo URLs for different types of listings
const logoPlaceholders = {
  wallet: [
    "https://v0.blob.com/wallet-logo-1.png",
    "https://v0.blob.com/wallet-logo-2.png",
    "https://v0.blob.com/wallet-logo-3.png",
  ],
  dapp: [
    "https://v0.blob.com/dapp-logo-1.png",
    "https://v0.blob.com/dapp-logo-2.png",
    "https://v0.blob.com/dapp-logo-3.png",
  ],
  learning: [
    "https://v0.blob.com/learning-logo-1.png",
    "https://v0.blob.com/learning-logo-2.png",
    "https://v0.blob.com/learning-logo-3.png",
  ],
  service: [
    "https://v0.blob.com/service-logo-1.png",
    "https://v0.blob.com/service-logo-2.png",
    "https://v0.blob.com/service-logo-3.png",
  ],
  event: [
    "https://v0.blob.com/event-logo-1.png",
    "https://v0.blob.com/event-logo-2.png",
    "https://v0.blob.com/event-logo-3.png",
  ],
  default: [
    "https://v0.blob.com/default-logo-1.png",
    "https://v0.blob.com/default-logo-2.png",
    "https://v0.blob.com/default-logo-3.png",
  ],
}

// Sample thumbnail URLs for media-type listings
const thumbnailPlaceholders = [
  "https://v0.blob.com/thumbnail-1.jpg",
  "https://v0.blob.com/thumbnail-2.jpg",
  "https://v0.blob.com/thumbnail-3.jpg",
  "https://v0.blob.com/thumbnail-4.jpg",
  "https://v0.blob.com/thumbnail-5.jpg",
]

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies }).schema("ethdir")

    // Get all listings
    const { data: listings, error } = await supabase.from("listings").select("id, name, type")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update each listing with a logo URL
    const updates = listings.map((listing) => {
      const typeLogos = logoPlaceholders[listing.type as keyof typeof logoPlaceholders] || logoPlaceholders.default
      const randomLogo = typeLogos[Math.floor(Math.random() * typeLogos.length)]

      // For media-type listings, also add a thumbnail
      const isMediaType = ["learn", "media", "books", "podcasts", "documentaries"].includes(listing.type)
      const thumbnail = isMediaType
        ? thumbnailPlaceholders[Math.floor(Math.random() * thumbnailPlaceholders.length)]
        : null

      return {
        id: listing.id,
        logo_url: randomLogo,
        thumbnail: thumbnail,
      }
    })

    // Perform the updates in batches
    const batchSize = 50
    const results = []

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize)
      const { data, error } = await supabase.from("listings").upsert(batch)

      if (error) {
        console.error(`Error updating batch ${i / batchSize + 1}:`, error)
      } else {
        results.push(data)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} listings with logo URLs and thumbnails`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
