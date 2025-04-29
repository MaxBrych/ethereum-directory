import { createSupabaseServerClient } from "@/lib/supabase"
import SubmitForm from "./submit-form"

export const dynamic = "force-dynamic"

export default async function SubmitPage() {
  const supabase = createSupabaseServerClient()

  // Fetch categories for the form
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  // Fetch tags for the form
  const { data: tags } = await supabase.from("tags").select("id, name").order("name")

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-4">Submit a Listing</h1>
        <p className="text-neutral-400">
          Share your Ethereum project with our community. The submission will be reviewed before being published.
        </p>
      </div>

      <SubmitForm categories={categories || []} tags={tags || []} />
    </div>
  )
}
