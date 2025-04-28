import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Create a client for the public schema
    const publicClient = createRouteHandlerClient({ cookies })

    // Create a client for the ethdir schema
    const ethdirClient = createRouteHandlerClient({ cookies }).schema("ethdir")

    // Check available schemas
    const { data: schemas, error: schemasError } = await publicClient
      .from("pg_catalog.pg_namespace")
      .select("nspname")
      .not("nspname", "in", "(pg_catalog,information_schema,pg_toast)")

    if (schemasError) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to query schemas: ${schemasError.message}`,
        },
        { status: 500 },
      )
    }

    // Check if ethdir schema exists
    const hasEthdirSchema = schemas?.some((s) => s.nspname === "ethdir") || false

    // Try to query the listings table in ethdir schema
    let ethdirListings = null
    let ethdirListingsError = null

    try {
      const { data, error } = await ethdirClient.from("listings").select("count(*)").single()
      ethdirListings = data
      ethdirListingsError = error?.message
    } catch (error: any) {
      ethdirListingsError = error.message
    }

    // Try to query the listings table in public schema
    let publicListings = null
    let publicListingsError = null

    try {
      const { data, error } = await publicClient.from("listings").select("count(*)").single()
      publicListings = data
      publicListingsError = error?.message
    } catch (error: any) {
      publicListingsError = error.message
    }

    return NextResponse.json({
      success: true,
      schemas: schemas?.map((s) => s.nspname) || [],
      hasEthdirSchema,
      ethdirListings,
      ethdirListingsError,
      publicListings,
      publicListingsError,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
