import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Hero from "@/components/hero";
import ListingCard from "@/components/listing-card";
import CategoryPanel from "@/components/category-panel";
import CategoryPanelMedia from "@/components/category-panel-media";
import NewsletterSubscription from "@/components/newsletter-subscription";
import ErrorMessage from "@/components/error-message";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createSupabaseServerClient();

  /* ------------ fetch -------------- */
  const { data: tags = [], error: tagsErr } = await supabase
    .from("tags")
    .select("id,name")
    .order("name");

  const { data: featured = [], error: listErr } = await supabase
    .from("listing_rank_v")
    .select("*")
    .order("score", { ascending: false })
    .limit(60); // get enough for panels

  /* ------------ group -------------- */
  const byType: Record<string, any[]> = {};
  featured.forEach((l) => {
    byType[l.type] ??= [];
    byType[l.type].push(l);
  });

  /* core & media groupings */
  const coreTypes = ["wallet", "dapp", "service", "event"];
  const mediaTypes = [
    { key: "learning", title: "Learning" },
    { key: "media", title: "Media" },
    { key: "books", title: "Books" },
    { key: "podcasts", title: "Podcasts" },
    { key: "documentaries", title: "Documentaries" },
  ];

  return (
    <>
      {tagsErr ? (
        <ErrorMessage
          title="Tag load failed"
          message={tagsErr.message}
          className="py-8"
        />
      ) : (
        <Hero tags={tags} />
      )}

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Featured row */}
        {featured.filter((f) => f.is_featured).length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-semibold">Featured Listings</h2>
              <Link
                href="/featured"
                className="flex items-center text-indigo-400 hover:text-indigo-300"
              >
                View Library <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featured
                .filter((l) => l.is_featured)
                .slice(0, 6)
                .map((l, idx) => (
                  <ListingCard key={l.id} listing={l} isNew={idx < 2} />
                ))}
            </div>
          </div>
        )}

        {/* Newsletter banner */}
        <NewsletterSubscription variant="banner" className="mb-16" />

        {/* ---------- core two-column panels ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {coreTypes.map((type) =>
            byType[type]?.length ? (
              <CategoryPanel
                key={type}
                title={type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                slug={type}
                listings={byType[type]}
              />
            ) : null
          )}
        </div>

        {/* ---------- media panels (one column with thumbnails) ---------- */}
        <div className="flex flex-col gap-12">
          {mediaTypes.map(({ key, title }) =>
            byType[key]?.length ? (
              <CategoryPanelMedia
                key={key}
                title={title}
                slug={key}
                listings={byType[key]}
              />
            ) : null
          )}
        </div>
      </div>
    </>
  );
}