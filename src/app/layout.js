import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: { default: "Sprint Shop", template: "%s | Sprint Shop" },
  description: "Giày thể thao chính hãng - Nike, Adidas, HOKA và nhiều thương hiệu hàng đầu",
  keywords: ["giày thể thao", "sneaker", "Nike", "Adidas", "HOKA"],
  openGraph: {
    title: "Sprint Shop",
    description: "Giày thể thao chính hãng",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
