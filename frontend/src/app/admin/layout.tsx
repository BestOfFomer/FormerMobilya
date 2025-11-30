import { Sidebar } from '@/components/admin/Sidebar';
import { AuthGuard } from '@/components/admin/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        
        {/* Main Content */}
        <div className="lg:pl-64">
          <main className="min-h-screen p-4 pt-15 lg:p-8 lg:pt-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
