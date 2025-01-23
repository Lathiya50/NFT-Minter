import { useState } from "react";
import { ethers } from "ethers";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { uploadToIPFS, createMetadata } from "../utils/ipfs";
import { CONTRACT_ADDRESS } from "../utils/config";
import NFTContract from "../artifacts/contracts/NFTContract.sol/NFTMarketplace.json";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const mintNFT = async (signer, tokenURI) => {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      NFTContract.abi,
      signer
    );
    const transaction = await contract.safeMint(
      await signer.getAddress(),
      tokenURI
    );
    return transaction.wait();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !name || !description) return;

    setLoading(true);
    setStatus(null);

    try {
      const imageCID = await uploadToIPFS({ file, name, description });
      const pinataContent = {
        name,
        description,
        image: `ipfs://${imageCID}`,
      };

      const pinataMetadata = {
        name: `${name}-metadata`,
        keyvalues: {
          collection: "NFT Collection",
          created: new Date().toISOString(),
          ...pinataContent,
        },
      };

      const data = { pinataContent, pinataMetadata };
      const metadataCID = await createMetadata(data);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      // await mintNFT(signer, `ipfs://${metadataCID}`);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTContract.abi,
        signer
      );
      const transaction = await contract.mintNFT(
        await signer.getAddress(),
        `ipfs://${metadataCID}`
      );
      await transaction.wait();

      setStatus({ type: "success", message: "NFT minted successfully!" });
      setFile(null);
      setName("");
      setDescription("");
      setPreview(null);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus({
        type: "error",
        message: error.message || "Failed to mint NFT. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl mx-auto">
      {status && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="mr-2" />
          ) : (
            <AlertTriangle className="mr-2" />
          )}
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            required
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            {preview ? (
              <img
                src={preview}
                alt="NFT Preview"
                className="mx-auto mb-4 w-64 h-64 object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="mb-4 h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition-colors">
                <Upload className="text-indigo-400 mb-2" size={40} />
                <p className="text-gray-500">Click to upload image</p>
              </div>
            )}
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NFT Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter NFT name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows={4}
            placeholder="Describe your NFT"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
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
              Minting...
            </>
          ) : (
            "Mint NFT"
          )}
        </button>
      </form>
    </div>
  );
}
