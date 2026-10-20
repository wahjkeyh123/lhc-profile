import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@fontsource-variable/bodoni-moda/wght.css";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "@fontsource-variable/noto-sans-sc/wght.css";
import "@fontsource-variable/noto-serif-sc/wght.css";

import { Providers } from "@/components/Providers";
import { Atmosphere } from "@/components/layout/Atmosphere";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/lib/data";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: site.title, template: `%s · ${site.title}` },
  description: site.tagline,
  applicationName: site.title,
  openGraph: {
    title: site.title,
    description: site.tagline,
    type: "website",
    locale: "zh_CN",
    images: ["/assets/profile/liu-haocun.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a2038",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <Providers>
          <Atmosphere />
          <CursorGlow />
          <SiteHeader />
          <main className="relative">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
