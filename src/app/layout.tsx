import Link from "next/link";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "ChromaCodex",
  description: "A readable paint, pigment, and color behavior database for artists."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="site-header__inner">
              <Link className="brand-lockup" href="/">
                <strong>ChromaCodex</strong>
                <span>Artist color intelligence</span>
              </Link>
              <nav className="nav-links" aria-label="Primary">
                <Link href="/browse">Browse</Link>
                <Link href="/reference">Reference</Link>
              </nav>
            </div>
          </header>
          {children}
          <footer className="footer-note">
            ChromaCodex v1 starts with a curated workbook-derived dataset and is designed to grow into a full artist paint database.
          </footer>
        </div>
      </body>
    </html>
  );
}
