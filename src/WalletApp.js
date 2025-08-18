import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const ETHERSCAN_API_KEY = 'YOUR_API_KEY';

const WalletApp = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [merkleRoot, setMerkleRoot] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [proof, setProof] = useState([]);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      localStorage.setItem("walletAddress", address);

      const bal = await provider.getBalance(address);
      setBalance(ethers.formatEther(bal));

      fetchTransactions(address);
    } else {
      alert("Please install MetaMask.");
    }
  };

  const fetchTransactions = async (address) => {
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "1" && data.result.length > 0) {
        console.log("Fetched Transactions Data:", data);
        setTransactions(data.result);
        generateMerkleTree(data.result);
      } else {
        console.warn("No transactions found.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const generateMerkleTree = (txs) => {
    const leaves = txs.map(tx => keccak256(tx.hash));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = tree.getRoot().toString('hex');
    setMerkleRoot(root);

    if (txs.length > 0) {
      const selectedTx = txs[0];
      const leaf = keccak256(selectedTx.hash);
      const proof = tree.getProof(leaf);
      const isValid = tree.verify(proof, leaf, tree.getRoot());

      setProof(proof.map(p => p.data.toString('hex')));
      setVerificationResult({
        txHash: selectedTx.hash,
        valid: isValid,
      });
    }
  };

  const sendETH = async () => {
    if (!account || !recipient || !amount) {
      alert("Please connect wallet and enter recipient + amount");
      return;
    }

    try {
      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: recipient,
            value: "0x" + ethers.parseEther(amount).toString(16),
          },
        ],
      });

      alert(`✅ Transaction sent! Hash: ${tx}`);
      console.log("Transaction Hash:", tx);
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("❌ Transaction failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🚀 MetaMask ETH Transaction
        </h1>

        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Connect MetaMask
          </button>
        ) : (
          <div className="text-center mb-4">
            <p className="text-sm text-green-600 font-mono break-all">
              ✅ Connected: {account}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              💰 Balance: {balance} ETH
            </p>
          </div>
        )}

        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendETH}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Send ETH
          </button>
        </div>

        <button
          onClick={() => window.location.href = "/transactions"}
          className="mt-6 w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200"
        >
          View Transactions
        </button>
      </div>
    </div>
  );
};

export default WalletApp;
