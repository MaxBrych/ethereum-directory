import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface SuccessMessageProps {
  title?: string
  message?: string
}

export default function SuccessMessage({
  title = "Submission Successful!",
  message = "Your listing has been submitted and will be reviewed by our team. Once approved, it will appear in the directory.",
}: SuccessMessageProps) {
  return (
    <Card className="bg-neutral-900 border-neutral-800 border-green-800 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-neutral-300">
        <p>
          Thank you for contributing to the Ethereum Directory. We typically review submissions within 2-3 business
          days.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
          <Link href="/submit" className="flex-1">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Submit Another Listing</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
