import React from "react";

function MerkleTreeViewer({ proofData, onClose }) {
  if (!proofData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-lg font-bold mb-4">🌳 Merkle Tree Viewer</h2>

        <p className="text-sm mb-2">
          <strong>Selected Tx Hash:</strong> {proofData.hash}
        </p>
        <p className="text-sm mb-2">
          <strong>Merkle Root:</strong> {proofData.root}
        </p>

        <div className="space-y-6 mt-4">
          {proofData.layers.map((layer, idx) => (
            <div key={idx} className="flex justify-center space-x-3">
              {layer.map((node, i) => (
                <div
                  key={i}
                  className="px-2 py-1 border rounded bg-gray-100 text-[10px] break-all max-w-[200px]"
                >
                  {node.slice(0, 10)}...
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default MerkleTreeViewer;
