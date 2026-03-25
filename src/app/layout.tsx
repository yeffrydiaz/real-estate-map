import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Estate Map Explorer",
  description:
    "Interactive property listing platform featuring map-based search, 3D virtual tours, and dynamic mortgage calculators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex flex-col">{children}</body>
    </html>
  );
}
