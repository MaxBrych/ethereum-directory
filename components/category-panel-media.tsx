import Link from "next/link";
import { ChevronRight } from "lucide-react";
import MediaCard from "./media-card";

export default function CategoryPanelMedia({
  title,
  slug,
  listings,
}: {
  title: string;
  slug: string;
  listings: any[];
}) {
  return (
    <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/50">
      <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {title}
        </h2>
        <Link
          href={`/${slug}`}
          className="flex items-center text-white hover:text-neutral-100"
        >
          View all products <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 px-5 py-4">
        {listings.slice(0, 3).map((l, idx) => (
          <MediaCard key={l.id} listing={l} isNew={idx === 0} />
        ))}
      </div>
    </div>
  );
}