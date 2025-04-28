import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { listingId } = await request.json()

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("listing_id", listingId)
      .eq("user_id", session.user.id)
      .maybeSingle()

    if (existingVote) {
      return NextResponse.json({ error: "Already voted" }, { status: 400 })
    }

    // Insert vote
    const { error } = await supabase.from("votes").insert({
      listing_id: listingId,
      user_id: session.user.id,
      weight: 1, // Default weight
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
