import React, { useEffect, useState } from 'react';
import './App.css';
import contractAddresses from './contract-addresses.json';
import AuraABI from './artifacts/contracts/Aura.sol/Aura.json';
import ExchangeABI from './artifacts/contracts/Exchange.sol/Exchange.json';

const ethers = require('ethers');

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [auraContract, setAuraContract] = useState(null);
  const [exchangeContract, setExchangeContract] = useState(null);
  const [ethAmount, setEthAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [minTokens, setMinTokens] = useState('');
  const [minEth, setMinEth] = useState('');
  const [ethToTokenReceipt, setEthToTokenReceipt] = useState(null);
  const [tokenToEthReceipt, setTokenToEthReceipt] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const auraContract = new ethers.Contract(contractAddresses.Aura, AuraABI.abi, signer);
          const exchangeContract = new ethers.Contract(contractAddresses.Exchange, ExchangeABI.abi, signer);

          console.log(exchangeContract)

          setProvider(provider);
          setSigner(signer);
          setAuraContract(auraContract);
          setExchangeContract(exchangeContract);
        } else {
          console.error("Please install MetaMask!");
        }
      } catch (error) {
        console.error("Error initializing contracts:", error);
      }
    };

    init();
  }, []);

  const addLiquidity = async () => {
    try {
      const tx = await exchangeContract.addLiquidity(ethAmount);
      await tx.wait();
      alert('Liquidity added');
    } catch (error) {
      console.error("Error adding liquidity:", error);
    }
  };

  const removeLiquidity = async () => {
    try {
      const tx = await exchangeContract.removeLiquidity(tokenAmount);
      const receipt = await tx.wait();
      alert('Liquidity removed');
      console.log('Remove Liquidity Receipt:', receipt);
    } catch (error) {
      console.error("Error removing liquidity:", error);
    }
  };

  const ethToTokenSwap = async () => {
    try {
      const tx = await exchangeContract.ethToTokenSwap(minTokens);
      const receipt = await tx.wait();
      setEthToTokenReceipt(receipt);
      alert('ETH to Token swap completed');
      console.log('ETH to Token Swap Receipt:', receipt);
    } catch (error) {
      console.error("Error swapping ETH to Token:", error);
    }
  };

  const tokenToEthSwap = async () => {
    try {
      const tx = await exchangeContract.tokenToEthSwap(ethers.parseEther(tokenAmount), ethers.parseEther(minEth));
      const receipt = await tx.wait();
      setTokenToEthReceipt(receipt);
      alert('Token to ETH swap completed');
      console.log('Token to ETH Swap Receipt:', receipt);
    } catch (error) {
      console.error("Error swapping Token to ETH:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Uniswap-like AMM</h1>
        <div className="liquidity-container">
          <div className="liquidity-box">
            <h2>Add Liquidity</h2>
            <input
              type="text"
              placeholder="ETH Amount"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
            />
            <button onClick={addLiquidity}>Add Liquidity</button>
          </div>
          <div className="liquidity-box">
            <h2>Remove Liquidity</h2>
            <input
              type="text"
              placeholder="Token Amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
            />
            <button onClick={removeLiquidity}>Remove Liquidity</button>
          </div>
        </div>
        <div className="swap-container">
          <div className="swap-box">
            <h2>ETH to Token Swap</h2>
            <input
              type="text"
              placeholder="ETH Amount"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Min Tokens"
              value={minTokens}
              onChange={(e) => setMinTokens(e.target.value)}
            />
            <button onClick={ethToTokenSwap}>ETH to Token Swap</button>
            {ethToTokenReceipt && (
              <div className="receipt">
                <h3>Transaction Receipt</h3>
                <pre>{JSON.stringify(ethToTokenReceipt, null, 2)}</pre>
              </div>
            )}
          </div>
          <div className="swap-box">
            <h2>Token to ETH Swap</h2>
            <input
              type="text"
              placeholder="Token Amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Min ETH"
              value={minEth}
              onChange={(e) => setMinEth(e.target.value)}
            />
            <button onClick={tokenToEthSwap}>Token to ETH Swap</button>
            {tokenToEthReceipt && (
              <div className="receipt">
                <h3>Transaction Receipt</h3>
                <pre>{JSON.stringify(tokenToEthReceipt, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
