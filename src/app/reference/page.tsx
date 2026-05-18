export default function ReferencePage() {
  return (
    <main className="page">
      <section className="content-section">
        <div className="eyebrow">Reference</div>
        <h1>Plain-language notes for artist color data</h1>
        <p className="lede">
          These definitions turn database fields into something useful. The goal is to help artists understand what a paint is made of, how it
          behaves, and why two similarly named colors may not actually be comparable.
        </p>
      </section>

      <section className="three-up">
        <article className="panel">
          <h2>Pigment code</h2>
          <p className="muted">
            Pigment codes identify the actual pigment, not the marketing name. Multiple manufacturers can sell very different colors with similar
            names, and the code often reveals whether they are actually related.
          </p>
        </article>
        <article className="panel">
          <h2>Opacity and transparency</h2>
          <p className="muted">
            These describe how much the paint blocks what is underneath. They matter for glazing, layering, and how color behaves in mixes and thin passages.
          </p>
        </article>
        <article className="panel">
          <h2>Permanence</h2>
          <p className="muted">
            Permanence is a durability signal. It does not tell the whole story by itself, but it helps artists compare whether a color is suitable for long-term work.
          </p>
        </article>
      </section>

      <section className="two-up content-section">
        <article className="callout">
          <h2>Why behavior gets its own record</h2>
          <p className="muted">
            A paint is more than its pigment list. Granulation, staining, flow, finish, open time, and viscosity may belong to the product line, the individual paint,
            or both, so ChromaCodex keeps behavior separate from identity.
          </p>
        </article>
        <article className="callout">
          <h2>Why source tracking matters</h2>
          <p className="muted">
            Manufacturer charts, third-party measurements, and artist-maintained references can disagree. ChromaCodex keeps source records so each fact can be traced back
            to where it came from and how trustworthy it is.
          </p>
        </article>
      </section>
    </main>
  );
}
