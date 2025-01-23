"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import NFTGrid from "../../components/NFTGrid";
import { CONTRACT_ADDRESS } from "../../utils/config";
import NFTContract from "../../artifacts/contracts/NFTContract.sol/NFTMarketplace.json";

export default function MyNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNFTs();
  }, []);

  async function fetchNFTs() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTContract.abi,
        signer
      );

      const address = await signer.getAddress();
      const balance = await contract.balanceOf(address);

      const nftList = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const tokenURI = await contract.tokenURI(tokenId);
        const metadata = await fetch(
          tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        ).then((res) => res.json());

        nftList.push({
          id: tokenId.toString(),
          name: metadata.name,
          description: metadata.description,
          image: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
        });
      }

      setNfts(nftList);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <Sparkles
            className="mx-auto animate-pulse text-indigo-500"
            size={64}
          />
          <p className="mt-4 text-xl text-gray-600">
            Loading your NFT collection...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <ImageIcon className="mx-auto text-red-500" size={64} />
          <p className="mt-4 text-xl text-red-600">Failed to load NFTs</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Sparkles className="mr-4 text-indigo-600" size={36} />
          <h1 className="text-4xl font-extrabold text-gray-900">
            My NFT Collection
          </h1>
        </div>
        <NFTGrid nfts={nfts} />
      </div>
    </div>
  );
}
