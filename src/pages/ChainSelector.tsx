import './ChainSelector.css'

export default function ChainSelector() {
  return (
    <div className="chain-selector-page">
      <div className="chain-container">
        <img src="/logo.png" alt="Pixel Ponies" className="chain-logo" />

        <h1 className="chain-title">Choose Your Chain</h1>

        <div className="chain-buttons">
          <a href="https://base.pxpony.com" className="chain-button base-button">
            Base
          </a>

          <a href="https://bnb.pxpony.com" className="chain-button bnb-button">
            BNB Chain
          </a>

          <a href="https://polygon.pxpony.com" className="chain-button polygon-button">
            Polygon
          </a>

          <a href="https://celo.pxpony.com" className="chain-button celo-button">
            Celo
          </a>
        </div>
      </div>
    </div>
  )
}
