import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const tag = searchParams.get("tag")
  const q = searchParams.get("q")

  const supabase = createRouteHandlerClient({ cookies }).schema("ethdir")

  // Build query - removing the status filter that was causing the error
  let query = supabase.from("listing_rank_v").select("*").order("score", { ascending: false })

  // Add filters
  if (type) {
    query = query.eq("type", type)
  }

  if (q) {
    query = query.ilike("name", `%${q}%`)
  }

  // Execute query
  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter by tag if provided
  let filteredData = data

  if (tag) {
    const tagIds = tag.split(",").map(Number)

    // Fetch listing_tags for the selected tags
    const { data: taggedListings } = await supabase.from("listing_tags").select("listing_id").in("tag_id", tagIds)

    if (taggedListings) {
      const taggedListingIds = new Set(taggedListings.map((item) => item.listing_id))
      filteredData = filteredData.filter((listing) => taggedListingIds.has(listing.id))
    }
  }

  return NextResponse.json(filteredData)
}
