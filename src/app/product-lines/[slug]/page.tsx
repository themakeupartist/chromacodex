import Link from "next/link";
import { notFound } from "next/navigation";

import { getPaintsForProductLine, productLines } from "@/data/chromacodex";
import { PaintCard } from "@/components/PaintCard";

type ProductLineDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductLineDetailPage({ params }: ProductLineDetailPageProps) {
  const { slug } = await params;
  const productLine = productLines.find((entry) => entry.slug === slug);

  if (!productLine) {
    notFound();
  }

  const linePaints = getPaintsForProductLine(productLine.slug);

  return (
    <main className="page">
      <Link className="text-link" href="/browse">
        Back to browse
      </Link>

      <section className="content-section">
        <div className="eyebrow">Product line</div>
        <h1>{productLine.name}</h1>
        <p className="lede">{productLine.notes}</p>
      </section>

      <section className="two-up">
        <article className="detail-card">
          <h2>Line attributes</h2>
          <dl className="stacked-meta">
            <div>
              <dt>Formulation family</dt>
              <dd>{productLine.formulationFamily}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{productLine.productLineType}</dd>
            </div>
            <div>
              <dt>Finish</dt>
              <dd>{productLine.finish ?? "Not yet captured"}</dd>
            </div>
            <div>
              <dt>Open time profile</dt>
              <dd>{productLine.openTimeProfile ?? "Not yet captured"}</dd>
            </div>
          </dl>
        </article>
        <article className="detail-card">
          <h2>Why product lines matter</h2>
          <p className="muted">
            The same paint name can behave very differently across heavy body, fluid, gouache, watercolor, or oil product lines, even when pigments overlap.
          </p>
        </article>
      </section>

      <section className="content-section">
        <div className="results-grid">
          {linePaints.map((paint) => (
            <PaintCard key={paint.id} paint={paint} />
          ))}
        </div>
      </section>
    </main>
  );
}
