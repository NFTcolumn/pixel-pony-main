import './Buy.css'

export default function Buy() {
  return (
    <div className="buy-page">
      <section className="buy-section">
        <h2>Buy $PONY</h2>
        <div className="buy-content">
          <p>
            $PONY is the native token for Pixel Ponies racing. Get yours on Base!
          </p>

          <div className="token-address-box">
            <h3>Token Address</h3>
            <code>
              0x6ab297799335E7b0f60d9e05439Df156cf694Ba7
            </code>
          </div>

          <h3 className="buy-links-title">Where to Buy</h3>
          <div className="buy-links">
            <a
              href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x6ab297799335E7b0f60d9e05439Df156cf694Ba7&chain=base"
              target="_blank"
              rel="noopener noreferrer"
              className="buy-link primary"
            >
              Buy on Uniswap
            </a>
            <a
              href="https://dexscreener.com/base/0x225182008f81686e4889c91f38c38fb1cf532fe8333893dd296a29bac06bb833"
              target="_blank"
              rel="noopener noreferrer"
              className="buy-link secondary"
            >
              View on DexScreener
            </a>
          </div>

          <div className="buy-disclaimer">
            <p>Make sure you're on Base network</p>
            <p>Always verify the contract address before buying</p>
          </div>
        </div>
      </section>
    </div>
  )
}
