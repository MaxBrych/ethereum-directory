import { notFound } from "next/navigation"
import ListingCard from "@/components/listing-card"
import FacetSidebar from "@/components/facet-sidebar"
import SearchBar from "@/components/search-bar"
import ErrorMessage from "@/components/error-message"
import SubHeader from "@/components/sub-header"
import { createSupabaseServerClient, createSupabaseAuthClient } from "@/lib/supabase"

interface PageProps {
  params: {
    type: string
  }
  searchParams: {
    tag?: string
    q?: string
  }
}

export default async function TypePage({ params, searchParams }: PageProps) {
  const { type } = params
  const { tag, q } = searchParams

  // Validate type
  const validTypes = ["wallet", "dapp", "learning", "service", "event"]
  if (!validTypes.includes(type)) {
    notFound()
  }

  const supabase = createSupabaseServerClient()
  const authClient = createSupabaseAuthClient()

  console.log(`Fetching data for ${type} page...`)

  // State to track errors
  let tagsError: Error | null = null
  let listingsError: Error | null = null
  let taggedListingsError: Error | null = null
  let listingTagsError: Error | null = null

  // Parse selected tags
  const selectedTags = tag ? tag.split(",").map(Number) : []

  // Fetch tags for this type
  const { data: tags, error: tagsErrorResponse } = await supabase.from("tags").select("id, name").order("name")

  if (tagsErrorResponse) {
    console.error("Error fetching tags:", tagsErrorResponse)
    tagsError = tagsErrorResponse
  }

  // Build query for listings - removing the status filter that was causing the error
  let query = supabase
    .from("listing_rank_v")
    .select("*")
    .eq("type", type)
    // Removed the problematic status filter
    .order("score", { ascending: false })

  // Add search filter if provided
  if (q) {
    query = query.ilike("name", `%${q}%`)
  }

  // Fetch listings
  const { data: listings, error: listingsErrorResponse } = await query

  if (listingsErrorResponse) {
    console.error("Error fetching listings:", listingsErrorResponse)
    listingsError = listingsErrorResponse
  }

  // Filter by tags if selected
  let filteredListings = listings || []
  let taggedListingIds = new Set()

  if (selectedTags.length > 0 && listings && listings.length > 0) {
    // Fetch listing_tags for the selected tags
    const { data: taggedListings, error: taggedListingsErrorResponse } = await supabase
      .from("listing_tags")
      .select("listing_id")
      .in("tag_id", selectedTags)

    if (taggedListingsErrorResponse) {
      console.error("Error fetching tagged listings:", taggedListingsErrorResponse)
      taggedListingsError = taggedListingsErrorResponse
    } else if (taggedListings) {
      taggedListingIds = new Set(taggedListings.map((item) => item.listing_id))
      filteredListings = filteredListings.filter((listing) => taggedListingIds.has(listing.id))
    }
  }

  // Get listing tags
  let listingTags = []
  if (filteredListings.length > 0) {
    const { data, error } = await supabase
      .from("listing_tags")
      .select("listing_id, tags:tag_id(id, name)")
      .in(
        "listing_id",
        filteredListings.map((listing) => listing.id),
      )

    if (error) {
      console.error("Error fetching listing tags:", error)
      listingTagsError = error
    } else {
      listingTags = data || []
    }
  }

  // Group tags by listing
  const tagsByListing =
    listingTags.reduce(
      (acc, { listing_id, tags }) => {
        if (!acc[listing_id]) {
          acc[listing_id] = []
        }
        if (tags) {
          acc[listing_id].push(tags)
        }
        return acc
      },
      {} as Record<string, any[]>,
    ) || {}

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1) + "s"

  return (
    <>
      <SubHeader tags={tags || []} selectedTags={selectedTags} type={type} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Keep the search bar for now, but we could remove it since it's in the header */}
        <SearchBar type={type} />

        {listingsError ? (
          <ErrorMessage
            title={`Failed to load ${typeLabel.toLowerCase()}`}
            message={`Error: ${listingsError.message}`}
          />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <FacetSidebar
              tags={tags || []}
              selectedTags={selectedTags}
              type={type}
              error={tagsError ? tagsError.message : null}
            />

            <div className="flex-1">
              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredListings.map((listing, index) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      tags={tagsByListing[listing.id] || []}
                      isNew={index < 2} // Mark first two as new for demo
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-neutral-900 rounded-lg">
                  <p className="text-neutral-400">No listings found matching your criteria.</p>
                </div>
              )}

              {taggedListingsError && (
                <div className="mt-4">
                  <ErrorMessage title="Failed to filter by tags" message={`Error: ${taggedListingsError.message}`} />
                </div>
              )}

              {listingTagsError && (
                <div className="mt-4">
                  <ErrorMessage title="Failed to load listing tags" message={`Error: ${listingTagsError.message}`} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
