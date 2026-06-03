import {
  Chain,
  ClobClient,
  OrderType,
  Side,
  SignatureType,
  type ApiKeyCreds,
  type TickSize,
} from '@polymarket/clob-client'
import type { WalletClient } from 'viem'
import type { SlipSelection } from '../../context/SlipContext'
import { canTradeSelection } from './selection'

const CREDS_PREFIX = 'oddshub-clob-creds-'

export function getClobHost(): string {
  const envProxy = import.meta.env.VITE_API_PROXY as string | undefined
  if (envProxy) return `${envProxy.replace(/\/$/, '')}/api/clob`
  if (typeof window !== 'undefined') return `${window.location.origin}/api/clob`
  return 'https://clob.polymarket.com'
}

function credsKey(address: string) {
  return `${CREDS_PREFIX}${address.toLowerCase()}`
}

function loadCreds(address: string): ApiKeyCreds | null {
  try {
    const raw = sessionStorage.getItem(credsKey(address))
    return raw ? (JSON.parse(raw) as ApiKeyCreds) : null
  } catch {
    return null
  }
}

function saveCreds(address: string, creds: ApiKeyCreds) {
  sessionStorage.setItem(credsKey(address), JSON.stringify(creds))
}

export function clearTradingSession(address: string) {
  sessionStorage.removeItem(credsKey(address))
}

/** EOA MetaMask-style wallet (signature type 0). Proxy/Safe users may need polymarket.com. */
export async function createTradingClient(
  walletClient: WalletClient,
  address: string,
): Promise<ClobClient> {
  const host = getClobHost()
  const bootstrap = new ClobClient(host, Chain.POLYGON, walletClient)

  let creds = loadCreds(address)
  if (!creds) {
    creds = await bootstrap.createOrDeriveApiKey()
    saveCreds(address, creds)
  }

  return new ClobClient(
    host,
    Chain.POLYGON,
    walletClient,
    creds,
    SignatureType.EOA,
    address,
  )
}

export interface PlaceOrderInput {
  selection: SlipSelection
  /** USDC stake per order (approx cost ≈ size × price) */
  stakeUsd: number
}

export interface PlaceOrderResult {
  selection: SlipSelection
  response: unknown
}

export async function placePolymarketOrder(
  client: ClobClient,
  { selection, stakeUsd }: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  if (!canTradeSelection(selection) || !selection.tokenId) {
    throw new Error('This selection cannot be traded on Polymarket from OddsHub.')
  }

  const price = selection.price
  const size = Math.max(stakeUsd / price, 1)
  const roundedSize = Math.floor(size * 100) / 100

  if (roundedSize < 1) {
    throw new Error('Stake too small — minimum ~$1 equivalent at this price.')
  }

  let tickSize: TickSize = '0.01'
  let negRisk = selection.negRisk ?? false

  try {
    tickSize = (await client.getTickSize(selection.tokenId)) as TickSize
    negRisk = await client.getNegRisk(selection.tokenId)
  } catch {
    if (selection.tickSize && ['0.1', '0.01', '0.001', '0.0001'].includes(selection.tickSize)) {
      tickSize = selection.tickSize as TickSize
    }
  }

  const response = await client.createAndPostOrder(
    {
      tokenID: selection.tokenId,
      price,
      size: roundedSize,
      side: Side.BUY,
    },
    { tickSize, negRisk },
    OrderType.GTC,
  )

  return { selection, response }
}

export async function placeAllOrders(
  client: ClobClient,
  selections: SlipSelection[],
  stakeUsd: number,
): Promise<PlaceOrderResult[]> {
  const tradable = selections.filter(canTradeSelection)
  if (!tradable.length) {
    throw new Error('No Polymarket selections with valid token IDs on your slip.')
  }

  const results: PlaceOrderResult[] = []
  for (const selection of tradable) {
    results.push(await placePolymarketOrder(client, { selection, stakeUsd }))
  }
  return results
}
