import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther, isAddress } from 'viem'
import { useSearchParams } from 'react-router-dom'
import './Referrals.css'

const REFERRAL_ADDRESS = '0x82249d29af7d7b1F20A63D7aa1248A40c58848e8'

const REFERRAL_ABI = [
  {
    inputs: [{ name: '_referrer', type: 'address' }],
    name: 'setReferrer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'player', type: 'address' }],
    name: 'referrerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'player', type: 'address' }],
    name: 'hasReferrer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'referrer', type: 'address' }],
    name: 'pendingRewards',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'referrer', type: 'address' }],
    name: 'getReferrerInfo',
    outputs: [
      { name: 'pending', type: 'uint256' },
      { name: 'canClaim', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'minClaimAmount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getStats',
    outputs: [
      { name: '_totalRewardsFunded', type: 'uint256' },
      { name: '_totalRewardsClaimed', type: 'uint256' },
      { name: '_totalReferrers', type: 'uint256' },
      { name: '_contractBalance', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const

export default function Referrals() {
  const { address, isConnected } = useAccount()
  const [searchParams] = useSearchParams()
  const [referralLink, setReferralLink] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Read contract data
  const { data: hasReferrerData, refetch: refetchHasReferrer } = useReadContract({
    address: REFERRAL_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: 'hasReferrer',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const { data: referrerInfoData, refetch: refetchReferrerInfo } = useReadContract({
    address: REFERRAL_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: 'getReferrerInfo',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const { data: globalStatsData } = useReadContract({
    address: REFERRAL_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: 'getStats'
  })

  const { data: minClaimAmountData } = useReadContract({
    address: REFERRAL_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: 'minClaimAmount'
  })

  // Generate referral link
  useEffect(() => {
    if (address) {
      const baseUrl = window.location.origin
      setReferralLink(`${baseUrl}/game?ref=${address}`)
    }
  }, [address])

  // Handle referral link from URL
  useEffect(() => {
    const handleReferralFromUrl = async () => {
      const refParam = searchParams.get('ref')
      if (!refParam || !address || !isConnected) return

      // Validate referrer address
      if (!isAddress(refParam)) {
        console.warn('Invalid referrer address')
        return
      }

      // Don't refer yourself
      if (refParam.toLowerCase() === address.toLowerCase()) {
        console.log('Cannot refer yourself')
        return
      }

      // Check if already has referrer
      if (hasReferrerData) {
        console.log('Already has a referrer')
        return
      }

      // Set referrer
      setStatusMessage('Setting up referral...')
      try {
        writeContract({
          address: REFERRAL_ADDRESS,
          abi: REFERRAL_ABI,
          functionName: 'setReferrer',
          args: [refParam as `0x${string}`]
        })
      } catch (error) {
        console.error('Error setting referrer:', error)
        setStatusMessage('Failed to set referrer')
      }
    }

    handleReferralFromUrl()
  }, [searchParams, address, isConnected, hasReferrerData, writeContract])

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      setStatusMessage('Referrer set successfully!')
      refetchHasReferrer()
      refetchReferrerInfo()
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }, [isConfirmed, refetchHasReferrer, refetchReferrerInfo])

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleClaim = async () => {
    if (!address) return
    setStatusMessage('Claiming rewards...')
    try {
      writeContract({
        address: REFERRAL_ADDRESS,
        abi: REFERRAL_ABI,
        functionName: 'claim'
      })
    } catch (error) {
      console.error('Error claiming:', error)
      setStatusMessage('Failed to claim rewards')
    }
  }

  // Parse contract data
  const pendingRewards = referrerInfoData && Array.isArray(referrerInfoData)
    ? parseFloat(formatEther(referrerInfoData[0])).toFixed(5)
    : '0.00000'

  const canClaim = referrerInfoData && Array.isArray(referrerInfoData)
    ? referrerInfoData[1]
    : false

  // Calculate approximate stats based on pending rewards
  // Each race gives 0.00005 ETH, so we can estimate races from rewards
  const pendingRewardsNum = referrerInfoData && Array.isArray(referrerInfoData)
    ? parseFloat(formatEther(referrerInfoData[0]))
    : 0

  const estimatedRaces = Math.floor(pendingRewardsNum / 0.00005)

  const minClaimAmount = minClaimAmountData ? parseFloat(formatEther(minClaimAmountData)).toFixed(4) : '0.0005'
  const racesNeeded = Math.max(0, 10 - estimatedRaces)

  // Global stats for display
  const totalRewardsFunded = globalStatsData && Array.isArray(globalStatsData)
    ? parseFloat(formatEther(globalStatsData[0])).toFixed(4)
    : '0.0000'

  const totalRewardsClaimed = globalStatsData && Array.isArray(globalStatsData)
    ? parseFloat(formatEther(globalStatsData[1])).toFixed(4)
    : '0.0000'

  const totalReferrers = globalStatsData && Array.isArray(globalStatsData)
    ? Number(globalStatsData[2])
    : 0

  if (!isConnected) {
    return (
      <div className="referrals-page">
        <section className="connect-prompt">
          <h2>Referral Program</h2>
          <p>
            Connect your wallet to access your referral dashboard
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="referrals-page">
      <div className="referrals-container">
        <h1>REFERRAL PROGRAM</h1>
        <p className="referrals-subtitle">
          EARN REWARDS BY SHARING PIXEL PONIES
        </p>

        {statusMessage && (
          <div className="status-message">
            {statusMessage}
          </div>
        )}

        {/* Your Referral Link */}
        <section className="referral-section">
          <h2>🔗 YOUR REFERRAL LINK</h2>
          <div className="referral-link-box">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="referral-link-input"
            />
            <button
              onClick={copyReferralLink}
              className={`copy-button ${copySuccess ? 'success' : 'default'}`}
            >
              {copySuccess ? 'COPIED!' : 'COPY LINK'}
            </button>
          </div>
          <p className="referral-hint">
            Share this link to earn rewards from every race your friends play!
          </p>
        </section>

        {/* Your Rewards */}
        <section className="rewards-section">
          <h2>💰 YOUR REWARDS</h2>
          <div className="rewards-card">
            <p className="rewards-label">PENDING REWARDS</p>
            <p className="rewards-value">
              {pendingRewards} ETH
            </p>
            <p className="rewards-info">
              🏇 Earn 0.00005 ETH per referred race!
            </p>
            <button
              onClick={handleClaim}
              disabled={!canClaim || isPending}
              className="claim-button"
              style={{ opacity: isPending ? 0.5 : 1 }}
            >
              {isPending
                ? 'CLAIMING...'
                : canClaim
                ? 'CLAIM REWARDS'
                : `NEED ${racesNeeded} MORE RACES (MIN: ${minClaimAmount} ETH)`
              }
            </button>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2>📋 HOW IT WORKS</h2>
          <ul>
            <li>Share your referral link with friends</li>
            <li>Earn 10% of race fees (0.00005 ETH) per race they play</li>
            <li>Claim rewards after 10+ referred races (min {minClaimAmount} ETH)</li>
            <li>No limit on referrals - earn forever! 💰</li>
          </ul>
        </section>

        {/* Your Stats */}
        <section className="stats-section">
          <h2>📊 YOUR STATS</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <p className="stat-box-label">EST. REFERRED RACES</p>
              <p className="stat-box-value">~{estimatedRaces}</p>
            </div>
            <div className="stat-box">
              <p className="stat-box-label">PENDING REWARDS</p>
              <p className="stat-box-value">{pendingRewards} ETH</p>
            </div>
            <div className="stat-box">
              <p className="stat-box-label">CAN CLAIM?</p>
              <p className="stat-box-value">{canClaim ? '✅ YES' : '❌ NO'}</p>
            </div>
          </div>
        </section>

        {/* Global Stats */}
        <section className="global-stats">
          <h2>🌐 GLOBAL REFERRAL STATS</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <p className="stat-box-label">TOTAL REFERRERS</p>
              <p className="stat-box-value">{totalReferrers}</p>
            </div>
            <div className="stat-box">
              <p className="stat-box-label">TOTAL FUNDED</p>
              <p className="stat-box-value">{totalRewardsFunded} ETH</p>
            </div>
            <div className="stat-box">
              <p className="stat-box-label">TOTAL CLAIMED</p>
              <p className="stat-box-value">{totalRewardsClaimed} ETH</p>
            </div>
          </div>
        </section>

        <div className="referrals-cta">
          <a href="/game" className="referrals-cta-button">
            🎮 PLAY NOW 🎮
          </a>
        </div>
      </div>
    </div>
  )
}
