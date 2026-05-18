import { FilterPanel } from "@/components/FilterPanel";
import { PaintCard } from "@/components/PaintCard";
import { filterPaints } from "@/data/chromacodex";

type BrowsePageProps = {
  searchParams?: Promise<{
    brand?: string;
    medium?: string;
    productLine?: string;
    pigment?: string;
    colorFamily?: string;
    opacity?: string;
    permanence?: string;
  }>;
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const filters = (await searchParams) ?? {};
  const results = filterPaints(filters);

  return (
    <main>
      <div className="page">
        <div className="eyebrow">Browse the database</div>
        <h1>Search paints by how artists actually think.</h1>
        <p className="lede">
          Filter by brand, medium, product line, pigment code, color family, opacity, and permanence without digging through confusing charts.
        </p>
      </div>

      <div className="browse-layout">
        <FilterPanel active={filters} />

        <section className="results-grid">
          <div className="detail-card">
            <div className="eyebrow">Current result set</div>
            <h2>{results.length} paint records</h2>
            <p className="muted">These results come from the normalized workbook import, so the browse view now reflects the local generated dataset instead of a tiny hand-curated sample.</p>
          </div>

          {results.map((paint) => (
            <PaintCard key={paint.id} paint={paint} />
          ))}

          {results.length === 0 ? (
            <div className="callout">
              <h3>No paints matched those filters.</h3>
              <p className="muted">Try clearing a few filters first. Some records are still incomplete, and the import will keep broadening as more brands and manufacturer sources are normalized.</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
