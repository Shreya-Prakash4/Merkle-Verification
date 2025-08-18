import SHA256 from "crypto-js/sha256";

// Generate Merkle Tree from transaction hashes
export function generateMerkleTree(transactions) {
  if (!transactions || transactions.length === 0) return null;

  let layer = transactions.map((tx) => SHA256(tx.hash).toString());
  const tree = [layer];

  while (layer.length > 1) {
    const nextLayer = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = i + 1 < layer.length ? layer[i + 1] : left;
      nextLayer.push(SHA256(left + right).toString());
    }
    tree.unshift(nextLayer); // root at index 0
    layer = nextLayer;
  }

  return { root: tree[0][0], layers: tree };
}

// Generate Merkle Proof for a transaction
export function generateMerkleProof(transactions, txHash) {
  if (!transactions || transactions.length === 0) return [];

  let index = transactions.findIndex((tx) => tx.hash === txHash);
  if (index === -1) return [];

  let layer = transactions.map((tx) => SHA256(tx.hash).toString());
  const proof = [];

  while (layer.length > 1) {
    const isRightNode = index % 2;
    const pairIndex = isRightNode ? index - 1 : index + 1;

    if (pairIndex < layer.length) {
      proof.push(layer[pairIndex]);
    }

    index = Math.floor(index / 2);
    const nextLayer = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = i + 1 < layer.length ? layer[i + 1] : left;
      nextLayer.push(SHA256(left + right).toString());
    }
    layer = nextLayer;
  }

  return proof;
}
