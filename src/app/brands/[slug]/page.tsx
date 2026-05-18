import Link from "next/link";
import { notFound } from "next/navigation";

import { brands, getPaintsForBrand } from "@/data/chromacodex";
import { PaintCard } from "@/components/PaintCard";

type BrandDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { slug } = await params;
  const brand = brands.find((entry) => entry.slug === slug);

  if (!brand) {
    notFound();
  }

  const brandPaints = getPaintsForBrand(brand.slug);

  return (
    <main className="page">
      <Link className="text-link" href="/browse">
        Back to browse
      </Link>

      <section className="content-section">
        <div className="eyebrow">Brand page</div>
        <h1>{brand.name}</h1>
        <p className="lede">{brand.notes}</p>
      </section>

      <section className="two-up">
        <article className="detail-card">
          <h2>Brand details</h2>
          <dl className="stacked-meta">
            <div>
              <dt>Manufacturer</dt>
              <dd>{brand.manufacturer}</dd>
            </div>
            <div>
              <dt>Synonyms</dt>
              <dd>{brand.synonyms.join(", ")}</dd>
            </div>
            <div>
              <dt>Starter paints</dt>
              <dd>{brandPaints.length}</dd>
            </div>
          </dl>
        </article>
        <article className="detail-card">
          <h2>Why this matters</h2>
          <p className="muted">
            Canonical brand normalization prevents the same manufacturer from fragmenting across ampersands, abbreviations, and retailer spellings.
          </p>
        </article>
      </section>

      <section className="content-section">
        <div className="results-grid">
          {brandPaints.map((paint) => (
            <PaintCard key={paint.id} paint={paint} />
          ))}
        </div>
      </section>
    </main>
  );
}
