import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-neutral-400 mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/">
        <Button className="flex items-center gap-2 bg-white hover:bg-neutral-100">
          <Home size={16} />
          <span>Back to Home</span>
          
        </Button>
      </Link>
    </div>
  )
}
