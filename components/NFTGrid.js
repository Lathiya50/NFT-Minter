import { useState } from "react";
import NFTCard from "./NFTCard";
import { Grid, PackageOpen } from "lucide-react";

export default function NFTGrid({ nfts, onTransfer }) {
  const [filterType, setFilterType] = useState("all");

  const filteredNFTs =
    filterType === "all" ? nfts : nfts.filter((nft) => nft.type === filterType);

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <PackageOpen className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-500 text-lg">
          No NFTs found in your collection
        </p>
        <p className="text-gray-400 mt-2">Mint your first NFT to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Grid className="mr-2" /> My NFT Collection
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All NFTs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNFTs.map((nft) => (
          <NFTCard key={nft.id} nft={nft} onTransfer={onTransfer} />
        ))}
      </div>

      {filteredNFTs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No NFTs match your filter</p>
        </div>
      )}
    </div>
  );
}
