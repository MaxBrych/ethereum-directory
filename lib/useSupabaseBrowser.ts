"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a singleton instance to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClientComponentClient> | null = null

export function getSupabaseBrowser() {
  if (!supabaseInstance) {
    supabaseInstance = createClientComponentClient()
  }
  return supabaseInstance
}

export default function useSupabaseBrowser() {
  const supabase = getSupabaseBrowser()
  // Apply the schema when the client is used
  return supabase.schema("ethdir")
}
