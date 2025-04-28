/* app/l/[slug]/page.tsx */
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import VoteButton from "@/components/vote-button";
import ListingCard from "@/components/listing-card";
import NewsletterSubscription from "@/components/newsletter-subscription";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerComponentClient({ cookies }).schema("ethdir");
  const { slug } = params;

  /* listing ----------------------------------------------------------- */
  const { data: listing } = await supabase
    .from("listing_rank_v")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!listing) notFound();

  /* featured ---------------------------------------------------------- */
  const { data: featured = [] } = await supabase
    .from("listing_rank_v")
    .select("*")
    .neq("id", listing.id)
    .order("score", { ascending: false })
    .limit(6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* back link sits under the global header */}
      <Link
        href={`/${listing.type}`}
        className="mb-6 inline-flex items-center gap-1 text-neutral-400 hover:text-neutral-200"
      >
        <ChevronLeft size={16} /> Back
      </Link>

      {/* media panel -------------------------------------------------- */}
      <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-6 lg:flex lg:gap-8">
        {/* hero */}
        {listing.thumbnail_url && (
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg lg:mb-0 lg:w-7/12">
            <Image
              src={listing.thumbnail_url}
              alt={`${listing.name} hero`}
              fill
              sizes="(min-width:1024px) 60vw, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* right column */}
        <div className="flex flex-1 flex-col">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-md bg-neutral-800">
              {listing.logo_url && (
                <Image
                  src={listing.logo_url}
                  alt={listing.name}
                  fill
                  sizes="48px"
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
            <h1 className="text-2xl font-semibold">{listing.name}</h1>
          </div>

          <p className="mb-8 max-w-prose text-neutral-300 leading-relaxed">
            {listing.long_desc || listing.short_desc}
          </p>

          <div className="mt-auto flex items-center gap-4">
            <VoteButton
              listingId={listing.id}
              votes={listing.total_votes}
              hasVoted={false}
            />

            <Link
              href={listing.url}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium hover:bg-indigo-700"
            >
              Open in New Tab <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* newsletter --------------------------------------------------- */}
      <div className="my-16">
        <NewsletterSubscription variant="banner" />
      </div>

      {/* featured ----------------------------------------------------- */}
      {featured.length > 0 && (
        <section className="mb-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Featured Tools</h2>
            <Link
              href="/featured"
              className="flex items-center text-indigo-400 hover:text-indigo-300"
            >
              View Library <ChevronLeft size={16} className="rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featured.map((f, i) => (
              <ListingCard key={f.id} listing={f} isNew={i < 2} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}