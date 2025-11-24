import { Link, Outlet } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useBalance, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { useState } from 'react'
import './Layout.css'

const PONY_TOKEN_ADDRESS = '0x6ab297799335E7b0f60d9e05439Df156cf694Ba7'

const PONY_TOKEN_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const

function formatPony(num: string): string {
  const absNum = Math.abs(parseFloat(num))
  if (absNum >= 1e12) return (absNum / 1e12).toFixed(1) + 'T'
  if (absNum >= 1e9) return (absNum / 1e9).toFixed(1) + 'B'
  if (absNum >= 1e6) return (absNum / 1e6).toFixed(1) + 'M'
  if (absNum >= 1e3) return (absNum / 1e3).toFixed(1) + 'K'
  return absNum.toFixed(2)
}

export default function Layout() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [showConnectors, setShowConnectors] = useState(false)

  const { data: ethBalance } = useBalance({
    address: address,
    query: { enabled: !!address }
  })

  const { data: ponyBalance } = useReadContract({
    address: PONY_TOKEN_ADDRESS,
    abi: PONY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const ethBalanceDisplay = ethBalance
    ? parseFloat(formatEther(ethBalance.value)).toFixed(4)
    : '0.0000'

  const ponyBalanceDisplay = ponyBalance
    ? formatPony(formatEther(ponyBalance))
    : '0'

  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-container">
          <div className="logo-section">
            <Link to="/">
              <img src="/logo.png" alt="Pixel Ponies" className="site-logo" />
            </Link>
            <div className="tagline">16 PIXELATED PONIES RACING ON-CHAIN</div>
          </div>

          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/game">Game</Link>
            <Link to="/referrals">Referrals</Link>
            <Link to="/story">Story</Link>
            <Link to="/whitepaper">Whitepaper</Link>
            <Link to="/buy">Buy</Link>
          </nav>

          <div className="wallet-section">
            {isConnected && address ? (
              <button onClick={() => disconnect()} className="disconnect-btn">
                Disconnect
              </button>
            ) : (
              <div className="connect-dropdown">
                <button
                  onClick={() => setShowConnectors(!showConnectors)}
                  className="connect-btn"
                >
                  Connect Wallet
                </button>
                {showConnectors && (
                  <div className="connector-menu">
                    {connectors.map((connector) => (
                      <button
                        key={connector.id}
                        onClick={() => {
                          connect({ connector })
                          setShowConnectors(false)
                        }}
                        className="connector-option"
                      >
                        {connector.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>Pixel Ponies</h4>
            <p>On-chain horse racing on Base</p>
          </div>
          <div className="footer-section">
            <h4>Links</h4>
            <nav className="footer-nav">
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/whitepaper">Whitepaper</Link>
            </nav>
          </div>
          <div className="footer-section">
            <h4>Social</h4>
            <div className="social-links">
              <a href="https://twitter.com/pixelponies" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://t.me/pixelponies" target="_blank" rel="noopener noreferrer">Telegram</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Contracts</h4>
            <div className="contract-links">
              <a href="https://basescan.org/address/0x6ab297799335E7b0f60d9e05439Df156cf694Ba7" target="_blank" rel="noopener noreferrer">PONY Token</a>
              <a href="https://basescan.org/address/0x2B4652Bd6149E407E3F57190E25cdBa1FC9d37d8" target="_blank" rel="noopener noreferrer">Game Contract</a>
              <a href="https://basescan.org/address/0x149c79eb6384cd54fb0f34358a7c65cdae8fb9d1" target="_blank" rel="noopener noreferrer">Vault</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>2024 Pixel Ponies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
