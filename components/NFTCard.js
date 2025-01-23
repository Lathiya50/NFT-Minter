import { useState } from "react";
import { ethers } from "ethers";
import { Copy, Send, AlertTriangle } from "lucide-react";
import { CONTRACT_ADDRESS } from "../utils/config";
import NFTContract from "../artifacts/contracts/NFTContract.sol/NFTMarketplace.json";

export default function NFTCard({ nft, onTransfer }) {
  const [toAddress, setToAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferStatus, setTransferStatus] = useState(null);

  async function handleTransfer(e) {
    e.preventDefault();
    setTransferStatus(null);

    if (!ethers.utils.isAddress(toAddress)) {
      setTransferStatus({
        type: "error",
        message: "Invalid Ethereum address",
      });
      return;
    }

    try {
      setIsTransferring(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTContract.abi,
        signer
      );

      const tx = await contract.transferFrom(
        await signer.getAddress(),
        toAddress,
        nft.id
      );
      await tx.wait();

      setTransferStatus({
        type: "success",
        message: "NFT transferred successfully!",
      });

      if (onTransfer) onTransfer();
      setShowTransfer(false);
    } catch (error) {
      console.error("Error transferring NFT:", error);
      setTransferStatus({
        type: "error",
        message: error.message || "Transfer failed",
      });
    } finally {
      setIsTransferring(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(nft.id);
    // Optional: Add a toast or small popup to show copied
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
      <div className="relative aspect-square">
        <img
          src={nft.image}
          alt={nft.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {nft.name}
          </h3>
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-indigo-600"
            title="Copy NFT ID"
          >
            <Copy size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{nft.description}</p>

        {transferStatus && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center ${
              transferStatus.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {transferStatus.type === "error" ? (
              <AlertTriangle className="mr-2" />
            ) : null}
            {transferStatus.message}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => setShowTransfer(!showTransfer)}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center"
          >
            <Send className="mr-2" size={18} />
            {showTransfer ? "Cancel Transfer" : "Transfer NFT"}
          </button>

          {showTransfer && (
            <form onSubmit={handleTransfer} className="space-y-2">
              <input
                type="text"
                placeholder="Recipient address (0x...)"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={isTransferring}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isTransferring ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Confirm Transfer"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
