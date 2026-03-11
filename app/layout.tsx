import type { Metadata } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-primary",
  subsets: ["hebrew"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "מערכת טפסים | מכללת תל חי",
  description: "טפסים דינמיים עם שדות בתנאי – המכללה האקדמית תל־חי",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${notoSansHebrew.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
