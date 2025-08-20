# 🪙 Ethereum Wallet with Merkle Tree Verification

A React-based Ethereum wallet application that allows users to:
- Connect with MetaMask
- View account balance and transaction history
- Generate Merkle Trees for transactions
- Verify transactions with Merkle Proofs
- Visualize the Merkle Tree structure interactively

## 🚀 Features

- 🔑 MetaMask Integration – Connect your Ethereum wallet seamlessly.
- 💰 Live Balance Fetching – Display real-time ETH balance.
- 📜 Transaction History – Fetch and display user’s transactions.
- 🌳 Merkle Tree Proofs – Generate proofs for each transaction.
- 🎨 Merkle Tree Visualization – Explore how transactions are structured in the Merkle Tree with zoom and pan features.



## 🛠️ Tech Stack

- Frontend: React, TailwindCSS
- Blockchain: Ethers.js, MetaMask
- Visualization: react-d3-tree



## 📂 Project Structure
```plaintext
eth-wallet-project/
│── public/                  # Static assets
│── src/
│   ├── components/
│   │   ├── MerkleTree.js        # Utility functions for Merkle Tree
│   │   ├── MerkleTreeViewer.js  # Interactive Merkle Tree diagram
│   │   └── Wallet.js            # Wallet connect & balance
│   ├── TransactionsPage.js      # Fetch transactions & show proofs
│   ├── App.js                   # Main app entry
│   └── index.js                 # React root
│── package.json
```



## ⚙️ Installation & Setup

1️⃣ Clone the repository
git clone https://github.com/yourusername/eth-wallet-project.git
cd eth-wallet-project

2️⃣ Install dependencies
npm install

3️⃣ Start the development server
npm start
Your app should now run at http://localhost:3000



## 🔑 Usage

- Open the app in your browser.
- Connect your MetaMask wallet.
- View your ETH balance and recent transactions.
- Click on any transaction to:
   - Generate its Merkle Proof
   - View the Merkle Tree structure



 ## 📜 Results 

 Wallet Dashboard


 Merkle Tree Visualization
 


 ## 📚 How Merkle Tree Verification Works

- Transactions are hashed.
- Hashes are paired and combined up to the Merkle Root.
- To prove a transaction’s validity, only its Merkle Proof (a small set of hashes) is required.
- This enables efficient and secure verification without exposing the entire transaction list.



  ## 🧩 Future Enhancements

- ✅ Add support for multiple blockchains (Polygon, BSC, etc.)
- ✅ Export Merkle Proofs as JSON files
- ✅ Deploy a backend to fetch historical transactions faster
- ✅ Interactive Nodes in the Merkle Tree.
 


