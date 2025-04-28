import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies }).schema("ethdir")

    const { error } = await supabase.from("email_subscriptions").insert({ email })

    if (error) {
      if (error.code === "23505") {
        // Unique violation
        return NextResponse.json({
          success: true,
          message: "Email already subscribed",
        })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed",
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
