import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletConnect = ({ onWalletConnect }) => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);

        const signer = await _provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        await fetchBalance(_provider, address);

        // Save to localStorage so TransactionsPage can use it
        window.localStorage.setItem("walletAddress", address);
        if (onWalletConnect) onWalletConnect(address);
      } catch (err) {
        alert("Error connecting: " + err.message);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchBalance = async (_provider, address) => {
    try {
      const bal = await _provider.getBalance(address);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  const sendETH = async () => {
    if (!recipient || !amount) {
      alert("Please enter a recipient and amount.");
      return;
    }
    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });
      alert(`Transaction Sent!\nHash: ${tx.hash}`);

      // ✅ Refresh balance after sending
      await fetchBalance(provider, await signer.getAddress());
    } catch (err) {
      if (err.code === "ACTION_REJECTED") {
        alert("Transaction rejected by user.");
      } else {
        alert("Transaction failed: " + err.message);
      }
    }
  };

  // ✅ Auto-refresh balance every 15 seconds
  useEffect(() => {
    if (provider && account) {
      const interval = setInterval(() => {
        fetchBalance(provider, account);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [provider, account]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Ethereum Wallet</h2>

      {!account ? (
        <button
          onClick={connectWallet}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="text-gray-700 mb-2">
            Connected:{" "}
            <span className="font-mono">
              {account.slice(0, 8)}...{account.slice(-6)}
            </span>
          </p>
          <p className="text-gray-700 mb-4">
            Balance: <strong>{balance} ETH</strong>
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="0x..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Amount (ETH)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="0.01"
            />
          </div>

          <button
            onClick={sendETH}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Send ETH
          </button>
        </>
      )}
    </div>
  );
};

export default WalletConnect;
