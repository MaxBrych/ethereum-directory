import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import SubmissionForm from "./submission-form"
import ContributorCTA from "./contributor-cta"

export default async function SubmitPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Get user profile to check role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  const isContributor = profile?.role === "contributor"

  // Fetch categories and tags for the form
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  const { data: tags } = await supabase.from("tags").select("id, name").order("name")

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Submit a Listing</h1>

      {isContributor ? <SubmissionForm categories={categories || []} tags={tags || []} /> : <ContributorCTA />}
    </div>
  )
}
