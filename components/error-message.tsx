import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorMessageProps {
  title: string
  message: string
}

export default function ErrorMessage({ title, message }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="bg-red-950 border-red-800 text-red-100">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">{message}</AlertDescription>
    </Alert>
  )
}
