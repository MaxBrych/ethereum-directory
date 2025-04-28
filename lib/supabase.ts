import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// This function returns a Supabase client with ethdir schema
export function createSupabaseServerClient() {
  // Create the base client first
  const baseClient = createServerComponentClient({ cookies })
  // Then apply the schema
  return baseClient.schema("ethdir")
}

// For auth operations that need the base client
export function createSupabaseAuthClient() {
  return createServerComponentClient({ cookies })
}

// For public schema access (if needed)
export function createSupabasePublicClient() {
  return createServerComponentClient({ cookies }) // default is public schema
}
