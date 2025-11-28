import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      
      <Header />
      <div className="flex pt-[73px]">
        <Sidebar />
        <main className="flex-1 p-8 relative">{children}</main>
      </div>
    </div>
  );
}
