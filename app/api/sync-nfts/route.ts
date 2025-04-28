import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Check if the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || session.user.id !== address.toLowerCase()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // This is where you would check for NFT ownership
    // For now, we'll just simulate the check
    const hasContributorNFT = false // Replace with actual NFT check

    // Update user role if they have the NFT
    if (hasContributorNFT) {
      await supabase.from("profiles").update({ role: "contributor" }).eq("id", address.toLowerCase())
    }

    return NextResponse.json({
      success: true,
      hasContributorNFT,
      role: hasContributorNFT ? "contributor" : "viewer",
    })
  } catch (error: any) {
    console.error("Error in sync-nfts:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
