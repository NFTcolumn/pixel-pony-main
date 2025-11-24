import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    walletConnect({ projectId: 'a7c920b15e31b08a73de71a7d4a55d9e' }),
  ],
  transports: {
    [base.id]: http()
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
