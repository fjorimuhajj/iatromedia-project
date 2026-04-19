import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Iatromedia | Medical News and Healthcare Insights",
    template: "%s | Iatromedia",
  },
  description:
    "Medical news, healthcare insights, expert articles, and specialty-focused content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
