import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <div className="callout">
        <div className="eyebrow">Not found</div>
        <h1>That record was not found in the current imported dataset.</h1>
        <p className="muted">The app scaffold and workbook import are connected now, but the data is still being refined as duplicates and missing behavior rows are reviewed.</p>
        <Link className="button" href="/browse">
          Return to browse
        </Link>
      </div>
    </main>
  );
}
