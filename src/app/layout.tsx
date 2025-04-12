import type { Metadata } from "next";
import "@/styles/globals.css";

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
    <html lang="en" className="h-full scroll-smooth">
      {children}
    </html>
  );
}