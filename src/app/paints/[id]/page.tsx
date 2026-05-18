import Link from "next/link";
import { notFound } from "next/navigation";

import { getBrandById, getMediumById, getPaintById, getProductLineById, rgbToCss } from "@/data/chromacodex";

type PaintDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaintDetailPage({ params }: PaintDetailPageProps) {
  const { id } = await params;
  const paint = getPaintById(id);

  if (!paint) {
    notFound();
  }

  const brand = getBrandById(paint.brandId);
  const medium = getMediumById(paint.mediumId);
  const productLine = getProductLineById(paint.productLineId);

  return (
    <main className="page">
      <Link className="text-link" href="/browse">
        Back to browse
      </Link>

      <div className="detail-layout">
        <section className="detail-card detail-hero">
          <div className="detail-swatch" style={{ background: rgbToCss(paint.measurement?.rgb ?? null) }} />
          <div className="detail-body">
            <div className="eyebrow">{brand?.name ?? "Unknown brand"}</div>
            <h1>{paint.name ?? "Unnamed paint"}</h1>
            <p className="lede">
              {medium?.name ?? "Unknown medium"} · {productLine?.name ?? "Unknown product line"} · {paint.verificationStatus ?? "Unknown status"}
            </p>
            <p className="muted">{paint.notes}</p>
          </div>
        </section>

        <section className="stacked-meta">
          <div className="detail-card">
            <h2>Identity</h2>
            <dl className="stacked-meta">
              <div>
                <dt>Paint ID</dt>
                <dd>{paint.id}</dd>
              </div>
              <div>
                <dt>Canonical key</dt>
                <dd>{paint.canonicalKey}</dd>
              </div>
              <div>
                <dt>Color family</dt>
                <dd>{paint.colorFamily ?? "Unknown"}</dd>
              </div>
              <div>
                <dt>Pigment codes</dt>
                <dd>{paint.pigmentCodes.length > 0 ? paint.pigmentCodes.join(", ") : "Not yet linked"}</dd>
              </div>
              <div>
                <dt>Single pigment</dt>
                <dd>{paint.singlePigment ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </div>

          <div className="detail-card">
            <h2>Behavior</h2>
            <dl className="stacked-meta">
              <div>
                <dt>Opacity code</dt>
                <dd>{paint.behavior.opacityCode ?? "Unknown"}</dd>
              </div>
              <div>
                <dt>Permanence</dt>
                <dd>{paint.behavior.permanence ?? "Unknown"}</dd>
              </div>
              <div>
                <dt>Transparency</dt>
                <dd>{paint.behavior.transparency ?? "Not yet captured"}</dd>
              </div>
              <div>
                <dt>Behavior source</dt>
                <dd>{paint.behavior.behaviorSource}</dd>
              </div>
            </dl>
          </div>

          <div className="detail-card">
            <h2>Measurement</h2>
            <dl className="stacked-meta">
              <div>
                <dt>Measurement type</dt>
                <dd>{paint.measurement?.type ?? "Not yet captured"}</dd>
              </div>
              <div>
                <dt>Density</dt>
                <dd>{paint.measurement?.density ?? "Unknown"}</dd>
              </div>
              <div>
                <dt>RGB</dt>
                <dd>
                  {paint.measurement?.rgb
                    ? `${paint.measurement.rgb.red}, ${paint.measurement.rgb.green}, ${paint.measurement.rgb.blue}`
                    : "Not yet captured"}
                </dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>{paint.measurement?.method ?? "Not yet captured"}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}
