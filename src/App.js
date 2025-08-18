import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WalletApp from './WalletApp';
import TransactionsPage from './TransactionsPage';

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 mb-6">
          <Link to="/" className="text-blue-600 font-bold">Wallet</Link>
          <Link to="/transactions" className="text-blue-600 font-bold">Transactions</Link>
        </nav>

        <Routes>
          <Route path="/" element={<WalletApp />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


