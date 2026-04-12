import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopHeader } from "@/components/dashboard/TopHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      <Sidebar />
      <div className="flex-1 ml-20 md:ml-24 flex flex-col">
        <TopHeader />
        <main className="flex-1 px-8 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
