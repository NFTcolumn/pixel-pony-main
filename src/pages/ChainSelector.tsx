import './ChainSelector.css'

export default function ChainSelector() {
  return (
    <div className="chain-selector-page">
      <section className="chain-hero">
        <img src="/logo.png" alt="Pixel Ponies" className="chain-logo" />
        <h1>Choose Your Chain</h1>
        <p className="chain-subtitle">Select your blockchain to start racing</p>
      </section>

      <section className="chain-grid">
        <a href="https://base.pxpony.com" className="chain-card base-chain">
          <div className="chain-icon">🔵</div>
          <h2>Base</h2>
          <p>Race on Base Network</p>
          <div className="chain-status">LIVE</div>
        </a>

        <a href="https://bnb.pxpony.com" className="chain-card bnb-chain">
          <div className="chain-icon">🟡</div>
          <h2>BNB Chain</h2>
          <p>Race on BNB Smart Chain</p>
          <div className="chain-status">LIVE</div>
        </a>
      </section>

      <section className="chain-info">
        <h3>What is Pixel Ponies?</h3>
        <p>16 Pixelated Ponies Racing On-Chain for No Reason</p>
        <p className="chain-description">
          A fully on-chain racing game where you bet PONY tokens on pixel ponies.
          Choose your chain above to start playing!
        </p>
      </section>
    </div>
  )
}
