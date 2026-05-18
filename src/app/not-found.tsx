import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <div className="callout">
        <div className="eyebrow">Not found</div>
        <h1>That record is not in the starter dataset yet.</h1>
        <p className="muted">The app scaffold is in place, but the imported dataset is still intentionally small while the schema and import flow get refined.</p>
        <Link className="button" href="/browse">
          Return to browse
        </Link>
      </div>
    </main>
  );
}
