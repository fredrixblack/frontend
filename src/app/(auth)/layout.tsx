import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Shorten and manage your URLs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body
      className={`${inter.className} flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950 antialiased bg-[url('/img/auth-bg.jpg')] bg-cover bg-center`}
    >
      <AuthProvider>
        <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto w-full">{children}</div>
        </main>
        <Toaster position="top-right" />
      </AuthProvider>
    </body>

  );
}