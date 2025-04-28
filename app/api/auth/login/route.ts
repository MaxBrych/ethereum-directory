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

    // Create or update profile
    await supabase.from("profiles").upsert({
      id: address.toLowerCase(),
      username: address.toLowerCase(),
      role: "viewer", // Default role
    })

    // For development purposes, we'll use a simplified auth approach
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${address.toLowerCase()}@ethereum.directory`,
      password: "password123", // This is a placeholder
    })

    if (error) {
      // If the user doesn't exist yet, create one
      if (error.message.includes("Invalid login credentials")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: `${address.toLowerCase()}@ethereum.directory`,
          password: "password123", // This is a placeholder
        })

        if (signUpError) throw signUpError

        return NextResponse.json({ session: signUpData.session })
      }

      throw error
    }

    return NextResponse.json({ session: data.session })
  } catch (error: any) {
    console.error("Error in login:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
