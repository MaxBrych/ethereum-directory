"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Database, RefreshCw } from "lucide-react"

export default function DatabaseHealthCheck() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    success: boolean
    message: string
    details?: Record<string, any>
  } | null>(null)

  const checkDatabase = async () => {
    setLoading(true)
    setResults(null)

    try {
      // Use the API route for database checks to avoid client-side limitations
      const response = await fetch("/api/debug")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to check database")
      }

      setResults({
        success: data.success,
        message: data.success ? "Successfully connected to database" : "Database check failed",
        details: data,
      })
    } catch (error: any) {
      setResults({
        success: false,
        message: `Database check failed: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Health Check
        </CardTitle>
        <CardDescription>Check your connection to the Supabase database and verify schema access</CardDescription>
      </CardHeader>
      <CardContent>
        {results && (
          <div
            className={`p-4 rounded-md mb-4 ${results.success ? "bg-green-950 text-green-100" : "bg-red-950 text-red-100"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {results.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              <p className="font-medium">{results.message}</p>
            </div>

            {results.details && (
              <div className="mt-4 text-sm">
                <p>
                  <strong>Available Schemas:</strong> {results.details.schemas?.join(", ") || "None found"}
                </p>
                <p>
                  <strong>ethdir Schema:</strong> {results.details.hasEthdirSchema ? "Found" : "Not found"}
                </p>

                <div className="mt-2">
                  <p>
                    <strong>ethdir.listings Table:</strong>
                  </p>
                  {results.details.ethdirListingsError ? (
                    <p className="text-red-300">Error: {results.details.ethdirListingsError}</p>
                  ) : (
                    <p>Found with {results.details.ethdirListings?.count || 0} records</p>
                  )}
                </div>

                <div className="mt-2">
                  <p>
                    <strong>public.listings Table:</strong>
                  </p>
                  {results.details.publicListingsError ? (
                    <p className="text-red-300">Error: {results.details.publicListingsError}</p>
                  ) : (
                    <p>Found with {results.details.publicListings?.count || 0} records</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkDatabase} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Check Database Connection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
