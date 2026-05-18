import Link from "next/link";

import {
  brands,
  mediums,
  productLines,
  uniqueColorFamilies,
  uniqueOpacityCodes,
  uniquePermanenceCodes
} from "@/data/chromacodex";

type FilterPanelProps = {
  active: {
    brand?: string;
    medium?: string;
    productLine?: string;
    pigment?: string;
    colorFamily?: string;
    opacity?: string;
    permanence?: string;
  };
};

function buildHref(active: FilterPanelProps["active"], key: string, value?: string) {
  const params = new URLSearchParams();
  const next = { ...active, [key]: value };

  Object.entries(next).forEach(([entryKey, entryValue]) => {
    if (entryValue) {
      params.set(entryKey, entryValue);
    }
  });

  const query = params.toString();
  return query ? `/browse?${query}` : "/browse";
}

export function FilterPanel({ active }: FilterPanelProps) {
  const colorFamilies = uniqueColorFamilies();
  const opacityCodes = uniqueOpacityCodes();
  const permanenceCodes = uniquePermanenceCodes();

  return (
    <aside className="filter-panel">
      <div className="filter-panel__header">
        <h2>Browse filters</h2>
        <Link className="text-link" href="/browse">
          Clear filters
        </Link>
      </div>

      <div className="filter-group">
        <h3>Brand</h3>
        {brands.map((brand) => (
          <Link key={brand.id} className={active.brand === brand.slug ? "chip chip--active" : "chip"} href={buildHref(active, "brand", brand.slug)}>
            {brand.name}
          </Link>
        ))}
      </div>

      <div className="filter-group">
        <h3>Medium</h3>
        {mediums.map((medium) => (
          <Link
            key={medium.id}
            className={active.medium === medium.slug ? "chip chip--active" : "chip"}
            href={buildHref(active, "medium", medium.slug)}
          >
            {medium.name}
          </Link>
        ))}
      </div>

      <div className="filter-group">
        <h3>Product line</h3>
        {productLines.map((line) => (
          <Link
            key={line.id}
            className={active.productLine === line.slug ? "chip chip--active" : "chip"}
            href={buildHref(active, "productLine", line.slug)}
          >
            {line.name}
          </Link>
        ))}
      </div>

      <div className="filter-group">
        <h3>Color family</h3>
        {colorFamilies.map((colorFamily) => (
          <Link
            key={colorFamily}
            className={active.colorFamily === colorFamily ? "chip chip--active" : "chip"}
            href={buildHref(active, "colorFamily", colorFamily)}
          >
            {colorFamily}
          </Link>
        ))}
      </div>

      <div className="filter-group">
        <h3>Opacity</h3>
        {opacityCodes.map((opacityCode) => (
          <Link
            key={opacityCode}
            className={active.opacity === opacityCode ? "chip chip--active" : "chip"}
            href={buildHref(active, "opacity", opacityCode)}
          >
            {opacityCode}
          </Link>
        ))}
      </div>

      <div className="filter-group">
        <h3>Permanence</h3>
        {permanenceCodes.map((permanenceCode) => (
          <Link
            key={permanenceCode}
            className={active.permanence === permanenceCode ? "chip chip--active" : "chip"}
            href={buildHref(active, "permanence", permanenceCode)}
          >
            {permanenceCode}
          </Link>
        ))}
      </div>
    </aside>
  );
}
