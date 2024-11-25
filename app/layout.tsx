import type { Metadata } from "next";
import localFont from "next/font/local";
import "./assets/styles/global/globals.scss";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Valet- und Parkservice leicht bestellt!",
  description: "Buchen Sie jetzt bequem online Ihren Valet- und Parkservice. Wir holen Ihr Fahrzeug ab, bringen es zurück, reinigen es auf Wunsch und bieten zusätzliche Services wie Tanken – alles für Ihre maximale Entspannung.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
</head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}
      >
        {children}
        
      </body>
    </html>
  );
}
