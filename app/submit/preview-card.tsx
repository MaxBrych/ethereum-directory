import Image from "next/image"
import { CardContent, Card } from "@/components/ui/card"

interface PreviewCardProps {
  name: string
  logoUrl: string
  shortDesc: string
  isNew?: boolean
}

export default function PreviewCard({ name, logoUrl, shortDesc, isNew = true }: PreviewCardProps) {
  return (
    <Card className="bg-neutral-900 rounded-xl overflow-hidden">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
          {logoUrl ? (
            <Image src={logoUrl || "/placeholder.svg"} alt={name} fill className="object-cover" unoptimized />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
              {name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold truncate">{name || "Project Name"}</h3>
            {isNew && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">NEW</span>
            )}
          </div>
          <p className="text-neutral-400 text-sm mt-1 line-clamp-2">
            {shortDesc || "Short description of the project will appear here"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
