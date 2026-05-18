import Link from "next/link";

import { PaintCard } from "@/components/PaintCard";
import { StatGrid } from "@/components/StatGrid";
import { paints, productLines, stats } from "@/data/chromacodex";

const featuredPaints = paints.slice(0, 3);

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-card hero-card--accent">
          <div className="eyebrow">Built for painters, not spreadsheets</div>
          <h1>Find the real story behind a paint color.</h1>
          <p className="lede">
            ChromaCodex is a web-first color database for artists that separates paint name, pigment identity, product line behavior, and
            source reliability into something you can actually read.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/browse">
              Browse the starter database
            </Link>
            <Link className="button-secondary" href="/reference">
              Learn the terminology
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="eyebrow">What v1 proves</div>
          <h2>A clean foundation for color comparison</h2>
          <p className="muted">
            The first build focuses on readable paint records, pigment lookups, product-line context, and behavior notes. Later tools like
            palette suggestions and paint mixing can grow on top of this structure.
          </p>
          <StatGrid items={stats} />
        </div>
      </section>

      <section className="content-section">
        <div className="page-header">
          <div>
            <div className="eyebrow">Starter records</div>
            <h2>Example paint entries</h2>
          </div>
          <Link className="text-link" href="/browse">
            See all starter paints
          </Link>
        </div>
        <div className="results-grid">
          {featuredPaints.map((paint) => (
            <PaintCard key={paint.id} paint={paint} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="three-up">
          <article className="panel">
            <div className="eyebrow">Structured data</div>
            <h3>Paints, pigments, and behavior are separate records</h3>
            <p className="muted">
              The workbook already pointed toward a relational model. This project carries that forward into normalized tables and a cleaner UI.
            </p>
          </article>
          <article className="panel">
            <div className="eyebrow">Public-first</div>
            <h3>Readable on desktop and mobile</h3>
            <p className="muted">
              The site is designed as a public browsing experience first, with app-like filtering layered on top instead of hiding everything
              behind logins.
            </p>
          </article>
          <article className="panel">
            <div className="eyebrow">Expandable</div>
            <h3>Ready for more brands and mediums</h3>
            <p className="muted">
              Current starter product lines include {productLines.map((line) => line.name).join(", ")}, and the schema is ready for broader ingestion.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
