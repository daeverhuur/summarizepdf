import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-[90px] pb-12">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1 p-8 rounded-3xl border border-slate-200 bg-white backdrop-blur-xl min-h-[calc(100vh-140px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
