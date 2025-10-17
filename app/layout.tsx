export const metadata = {
  title: "TEKKIN",
  description: "Tekkin Core — site base",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <nav className="nav">
          <a href="/" className="gradText" style={{ fontWeight: 800, fontSize: 22 }}>
            TEKKIN
          </a>
          <div style={{ display:"flex", gap:18 }}>
            <a href="/visual">Visual</a>
            <a href="/success">Success</a>
            <a href="/cancel">Cancel</a>
          </div>
        </nav>
        <main className="container">{children}</main>
        <footer className="footer container">
          © {new Date().getFullYear()} Tekkin — Davide Marsala
        </footer>
      </body>
    </html>
  );
}
