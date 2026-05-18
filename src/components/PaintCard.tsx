import Link from "next/link";

import { getBrandById, getMediumById, getProductLineById, rgbToCss, type Paint } from "@/data/chromacodex";

type PaintCardProps = {
  paint: Paint;
};

export function PaintCard({ paint }: PaintCardProps) {
  const brand = getBrandById(paint.brandId);
  const medium = getMediumById(paint.mediumId);
  const line = getProductLineById(paint.productLineId);

  return (
    <article className="paint-card">
      <div className="paint-card__swatch" style={{ background: rgbToCss(paint.measurement?.rgb ?? null) }} />
      <div className="paint-card__content">
        <div className="eyebrow">{brand?.name}</div>
        <h3>{paint.name}</h3>
        <p className="muted">
          {medium?.name} · {line?.name}
        </p>
        <dl className="inline-meta">
          <div>
            <dt>Pigment</dt>
            <dd>{paint.pigmentCodes.join(", ")}</dd>
          </div>
          <div>
            <dt>Family</dt>
            <dd>{paint.colorFamily}</dd>
          </div>
          <div>
            <dt>Opacity</dt>
            <dd>{paint.behavior.opacityCode ?? "Unknown"}</dd>
          </div>
          <div>
            <dt>Permanence</dt>
            <dd>{paint.behavior.permanence ?? "Unknown"}</dd>
          </div>
        </dl>
        <Link className="text-link" href={`/paints/${paint.id}`}>
          View paint record
        </Link>
      </div>
    </article>
  );
}
