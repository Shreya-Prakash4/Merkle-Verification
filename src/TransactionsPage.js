import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { generateMerkleTree, generateMerkleProof } from "./MerkleTree";
import MerkleTreeViewer from "./MerkleTreeViewer"; // ✅ import viewer

const ETHERSCAN_API_KEY = "8AC23JY7BG9P3P9FER92Q852PERKAUEBDK";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProof, setSelectedProof] = useState(null);
  const [showProof, setShowProof] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const address = window.localStorage.getItem("walletAddress");

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;
      setLoading(true);
      setError("");

      try {
        const url = `https://api-sepolia.etherscan.io/api
          ?module=account
          &action=txlist
          &address=${address}
          &startblock=0
          &endblock=99999999
          &page=1
          &offset=20
          &sort=desc
          &apikey=${ETHERSCAN_API_KEY}`.replace(/\s+/g, "");

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "1") {
          setTransactions(data.result);
        } else {
          setError("No transactions found on Sepolia.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch transactions.");
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [address]);

  const handleViewProof = (tx) => {
    const tree = generateMerkleTree(transactions);
    const proof = generateMerkleProof(transactions, tx.hash);

    setSelectedProof({
      hash: tx.hash,
      root: tree.root,
      proof,
      layers: tree.layers,
    });
    setSelectedTx(tx);
    setShowProof(true);
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-gray-700 mb-2">
        📜 Recent Sepolia Transactions
      </h2>

      {loading && <p className="text-gray-500">Fetching transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {transactions.length === 0 && !loading && !error ? (
        <p className="text-gray-500 text-sm">No transactions found</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto border p-3 rounded-lg">
          {transactions.map((tx) => (
            <li
              key={tx.hash}
              className="p-3 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition"
            >
              <p>
                <span className="font-semibold">Hash:</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {tx.hash.slice(0, 20)}...
                </a>
              </p>
              <p>
                <span className="font-semibold">From:</span>{" "}
                {tx.from.slice(0, 12)}...
              </p>
              <p>
                <span className="font-semibold">To:</span>{" "}
                {tx.to ? tx.to.slice(0, 12) : "Contract"}...
              </p>
              <p>
                <span className="font-semibold">Value:</span>{" "}
                {ethers.formatEther(tx.value)} ETH
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {tx.isError === "0" ? "✅ Success" : "❌ Failed"}
              </p>
              <button
                onClick={() => handleViewProof(tx)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
              >
                View Merkle Proof
              </button>
            </li>
          ))}
        </ul>
      )}

      {showProof && selectedProof && (
        <MerkleTreeViewer
          proofData={selectedProof}
          onClose={() => setShowProof(false)}
        />
      )}
    </div>
  );
}

export default TransactionsPage;
