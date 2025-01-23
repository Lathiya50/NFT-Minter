import Head from "next/head";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>NFT Minting dApp</title>
        <meta name="description" content="NFT Minting dApp" />
      </Head>

      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  NFT Minter
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent"
                >
                  Mint NFT
                </Link>
                <Link
                  href="/my-nfts"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent"
                >
                  My NFTs
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
