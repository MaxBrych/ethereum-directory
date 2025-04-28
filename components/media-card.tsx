import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface MediaListing {
  id: string;
  name: string;
  slug: string;
  thumbnail_url: string | null;
  short_desc: string | null;
  is_featured?: boolean;
}

export default function MediaCard({
  listing,
  isNew = false,
}: {
  listing: MediaListing;
  isNew?: boolean;
}) {
  return (
    <Link
      href={`/l/${listing.slug}`}
      className="group flex flex-col gap-2 rounded-xl bg-neutral-900/60 p-3 transition hover:bg-neutral-800/70"
    >
      {/* hero thumbnail */}
      <div className="relative h-40 w-full overflow-hidden rounded-lg bg-neutral-800">
        {listing.thumbnail_url && (
          <Image
            src={listing.thumbnail_url}
            alt={listing.name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(min-width: 640px) 240px, 100vw"
            unoptimized
          />
        )}
      </div>

      {/* title + meta */}
      <div className="flex items-center gap-2">
        <h3 className="truncate text-sm font-semibold">{listing.name}</h3>
        {isNew && (
          <Badge className="bg-indigo-600 px-1 py-0 text-[10px] font-medium">
            NEW
          </Badge>
        )}
      </div>
      {listing.short_desc && (
        <p className="line-clamp-1 text-xs text-neutral-400">
          {listing.short_desc}
        </p>
      )}
    </Link>
  );
}