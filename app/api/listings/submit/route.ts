import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies }).schema("ethdir")

  try {
    const { name, slug, type, url, logo_url, thumbnail_url, short_desc, long_desc, source_link, category_id, tags } =
      await request.json()

    // First, insert the listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert({
        name,
        slug,
        type,
        url,
        logo_url,
        thumbnail_url,
        short_desc,
        long_desc,
        source_link,
        category_id,
        status: "pending", // Default status for new submissions
      })
      .select("id")
      .single()

    if (listingError) {
      console.error("Error inserting listing:", listingError)
      return NextResponse.json({ error: listingError.message }, { status: 500 })
    }

    // Then insert the tags if we have any
    if (tags && tags.length > 0) {
      const tagConnections = tags.map((tagId: number) => ({
        listing_id: listing.id,
        tag_id: tagId,
      }))

      const { error: tagError } = await supabase.from("listing_tags").insert(tagConnections)

      if (tagError) {
        console.error("Error inserting tags:", tagError)
        return NextResponse.json({ error: tagError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, listing })
  } catch (error: any) {
    console.error("Error in submit route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
