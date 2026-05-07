import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/boxed/ThemeProvider";
import localFont from "next/font/local"
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import './i18n';
import Header from "@/components/layout/Header";
import CursorLabProvider from "@/components/boxed/CursorLabProvider";

export const metadata: Metadata = {
  title: "Sunny_ZY's website",
  description: "Personal website of Sunny_ZY",
  icons: {
    icon: "/favicon.ico"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// 导入Playpen Sans字体
const playpenSans = localFont({
  src: [
    { path: '../fonts/Playpen_Sans/PlaypenSans-VariableFont_wght.ttf' }
  ],
  variable: '--font-playpen-sans'
})

// 导入Kiwi Maru字体
const kiwiMaru = localFont({
  src: [
    { path: '../fonts/Kiwi_Maru/KiwiMaru-Light.ttf', weight: '300' },
    { path: '../fonts/Kiwi_Maru/KiwiMaru-Regular.ttf', weight: '400' },
    { path: '../fonts/Kiwi_Maru/KiwiMaru-Medium.ttf', weight: '500' }
  ],
  variable: '--font-kiwi-maru'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playpenSans.variable} ${kiwiMaru.variable} ${kiwiMaru.className}`}>
        <ThemeProvider>
          <CursorLabProvider>
            <Header />
            {children}
          </CursorLabProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
