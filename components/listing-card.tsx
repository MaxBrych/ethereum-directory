/* components/listing-card.tsx */
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface Listing {
  id: string;
  name: string;
  slug: string;
  short_desc: string | null;
  logo_url: string | null;
}
export default function ListingCard({
  listing,
  isNew = false,
}: {
  listing: Listing;
  isNew?: boolean;
}) {
  const { name, slug, short_desc, logo_url } = listing;

  return (
    <Link
      href={`/l/${slug}`}
      className="group flex items-start gap-3 rounded-lg px-2 py-1 transition hover:bg-neutral-800/40"
    >
      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-md">
        {logo_url ? (
          <Image
            src={logo_url}
            alt={name}
            fill
            sizes="48px"
            
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-500">
            {name.charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <h3 className="truncate text-sm font-semibold">{name}</h3>
          {isNew && (
            <Badge className="bg-white px-1 py-0 text-[10px] font-medium">
              NEW
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-neutral-400">{short_desc}</p>
      </div>
    </Link>
  );
}