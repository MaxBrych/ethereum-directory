import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DatabaseHealthCheck from "@/components/database-health-check"

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      <p className="text-neutral-400 mb-8">
        Use these tools to diagnose and troubleshoot your Ethereum Directory application.
      </p>

      <div className="space-y-8">
        <DatabaseHealthCheck />
      </div>
    </div>
  )
}
