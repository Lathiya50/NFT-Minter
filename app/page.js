"use client";
import { Rocket } from "lucide-react";
import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full mb-4">
            <Rocket className="mr-2" size={20} />
            <span className="text-sm font-medium">Create Your NFT</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Mint Your Digital Masterpiece
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your creativity into a unique blockchain-verified
            collectible
          </p>
        </div>
        <UploadForm />
      </div>
    </div>
  );
}
