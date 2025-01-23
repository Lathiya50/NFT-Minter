"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, Wallet } from "lucide-react";

export default function ConnectWallet() {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  async function checkIfWalletIsConnected() {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        setError("MetaMask not detected");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  }

  async function connectWallet() {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        setError("Install MetaMask first");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setError(null);
    } catch (error) {
      setError(error.message || "Wallet connection failed");
    }
  }

  if (loading) {
    return (
      <button
        disabled
        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md flex items-center"
      >
        <Wallet className="mr-2" />
        Connecting...
      </button>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-md">
        <AlertTriangle className="text-red-500" />
        <span>{error}</span>
        <button
          onClick={connectWallet}
          className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
    >
      <Wallet className="mr-2" />
      {account
        ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
}
