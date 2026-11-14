import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../src/components/layout/Sidebar";
import Header from "../src/components/layout/Header";

export const metadata: Metadata = {
  title: "EstateIQ | Bengaluru Housing Intelligence",
  description:
    "Machine learning powered Bengaluru housing price prediction and real estate analytics dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">

          {/* Fixed Sidebar */}
          <aside className="fixed left-0 top-0 h-screen w-64 shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <div className="ml-64 flex min-w-0 flex-1 flex-col">

            {/* Fixed Header */}
            <div className="sticky top-0 z-40 shrink-0">
              <Header />
            </div>

            {/* Scrollable Content */}
            <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-8">
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}