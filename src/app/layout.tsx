import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Lisso — Task Management Dashboard",
  description: "Modern full-stack task management dashboard connected to RESTful API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F4EFEA] text-[#18181B] antialiased selection:bg-amber-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
