import Link from "next/link";
import { notFound } from "next/navigation";

import { getPaintsForPigment, pigments } from "@/data/chromacodex";
import { PaintCard } from "@/components/PaintCard";

type PigmentDetailPageProps = {
  params: Promise<{
    code: string;
  }>;
};

export default async function PigmentDetailPage({ params }: PigmentDetailPageProps) {
  const { code } = await params;
  const pigment = pigments.find((entry) => entry.slug === code.toLowerCase());

  if (!pigment) {
    notFound();
  }

  const relatedPaints = pigment.code ? getPaintsForPigment(pigment.code) : [];

  return (
    <main className="page">
      <Link className="text-link" href="/browse">
        Back to browse
      </Link>

      <section className="content-section">
        <div className="eyebrow">Pigment record</div>
        <h1>{pigment.code ?? "Unknown pigment code"}</h1>
        <p className="lede">{pigment.notes ?? "Pigment notes will expand as manufacturer and pigment reference data grows."}</p>
      </section>

      <section className="two-up">
        <article className="detail-card">
          <h2>Details</h2>
          <dl className="stacked-meta">
            <div>
              <dt>Pigment ID</dt>
              <dd>{pigment.id}</dd>
            </div>
            <div>
              <dt>Color family</dt>
              <dd>{pigment.colorFamily}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{pigment.status}</dd>
            </div>
          </dl>
        </article>
        <article className="detail-card">
          <h2>Used in these paints</h2>
          <p className="muted">{relatedPaints.length} imported paint records currently reference this pigment code.</p>
        </article>
      </section>

      <section className="content-section">
        <div className="results-grid">
          {relatedPaints.map((paint) => (
            <PaintCard key={paint.id} paint={paint} />
          ))}
        </div>
      </section>
    </main>
  );
}
