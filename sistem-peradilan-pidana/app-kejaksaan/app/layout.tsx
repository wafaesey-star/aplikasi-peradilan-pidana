import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Aplikasi Kejaksaan', description: 'P21, dakwaan, tuntutan' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="topbar kejaksaan">
          <div className="brand">⚖️ Aplikasi Kejaksaan</div>
          <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/berkas">Berkas Masuk</Link>
            <Link href="/dakwaan">P21 / Dakwaan</Link>
            <Link href="/tuntutan">Tuntutan</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
