import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Aplikasi Pengadilan', description: 'Sidang, putusan, vonis' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="topbar pengadilan">
          <div className="brand">🏛️ Aplikasi Pengadilan</div>
          <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/dakwaan">Dakwaan Masuk</Link>
            <Link href="/sidang">e-Court (Sidang)</Link>
            <Link href="/putusan">Putusan / Vonis</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
