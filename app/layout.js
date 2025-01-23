import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "../components/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NFT Minter | Blockchain Collectibles",
  description: "Create, Mint, and Manage Your Unique NFTs",
  openGraph: {
    title: "NFT Minter",
    description: "Your Gateway to Digital Collectibles",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
