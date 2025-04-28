import ListingCard from "@/components/listing-card"
import ErrorMessage from "@/components/error-message"
import { createSupabaseServerClient } from "@/lib/supabase"

interface PageProps {
  searchParams: {
    q?: string
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = searchParams

  if (!q) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12 bg-neutral-900 rounded-lg">
            <p className="text-neutral-400">Please enter a search term to find listings.</p>
          </div>
        </div>
      </>
    )
  }

  const supabase = createSupabaseServerClient()

  console.log(`Searching for: ${q}`)

  // State to track errors
  let listingsError: Error | null = null
  let listingTagsError: Error | null = null

  // Fetch listings matching the search query
  const { data: listings, error: listingsErrorResponse } = await supabase
    .from("listing_rank_v")
    .select("*")
    .ilike("name", `%${q}%`)
    .order("score", { ascending: false })

  if (listingsErrorResponse) {
    console.error("Error fetching listings:", listingsErrorResponse)
    listingsError = listingsErrorResponse
  }

  // Get listing tags if we have listings
  let listingTags = []
  if (listings && listings.length > 0) {
    const { data, error } = await supabase
      .from("listing_tags")
      .select("listing_id, tags:tag_id(id, name)")
      .in(
        "listing_id",
        listings.map((listing) => listing.id),
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

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Search Results for "{q}"</h1>
          <p className="text-neutral-400 mt-2">Found {listings?.length || 0} results</p>
        </div>

        {listingsError ? (
          <ErrorMessage title="Failed to load search results" message={`Error: ${listingsError.message}`} />
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing, index) => (
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
            <p className="text-neutral-400">No listings found matching "{q}".</p>
          </div>
        )}

        {listingTagsError && (
          <div className="mt-4">
            <ErrorMessage title="Failed to load listing tags" message={`Error: ${listingTagsError.message}`} />
          </div>
        )}
      </div>
    </>
  )
}
