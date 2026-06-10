import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Aplikasi Lapas', description: 'Hunian, remisi, status bebas' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="topbar lapas">
          <div className="brand">🏢 Aplikasi Lapas</div>
          <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/napi">Hunian / Napi</Link>
            <Link href="/remisi">Remisi</Link>
            <Link href="/bebas">Status Bebas</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
