import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Aplikasi Polisi', description: 'SPDP, BAP, data tersangka' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="topbar polisi">
          <div className="brand">🚓 Aplikasi Polisi</div>
          <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/tersangka">Tersangka</Link>
            <Link href="/spdp">SPDP</Link>
            <Link href="/bap">BAP Digital</Link>
            <Link href="/notif">Notif Bebas</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
