/**
 * LI.FI cross-chain bridge client.
 *
 * Use case: user holds funds on any EVM chain (Ethereum, Base, Arbitrum, …)
 * and wants to send USDm or USDC to a recipient on Celo.
 *
 * Flow:
 *  1. Call getBridgeQuote() — returns calldata the user signs on the source chain.
 *  2. User broadcasts the tx from their wallet.
 *  3. LI.FI relays funds to Celo; recipient receives USDm/USDC.
 *  4. Poll getBridgeStatus() until status === "DONE".
 */

import { CELO_USDM_ADDRESS, CELO_USDC_ADDRESS } from "./celoTokens.js";

const LIFI_BASE = "https://li.quest/v1";
const INTEGRATOR = process.env.LIFI_INTEGRATOR?.trim() || "sendpay";
export const CELO_CHAIN_ID = 42220;

// ── Types ─────────────────────────────────────────────────────────────────────

export type SupportedDestToken = "USDm" | "USDC";

export type BridgeQuoteParams = {
  /** Chain the user is sending FROM (e.g. 1=Ethereum, 8453=Base, 42161=Arbitrum) */
  fromChainId: number;
  /** Token address on the source chain */
  fromTokenAddress: string;
  /** Amount in base units as a string (e.g. "100000000" for 100 USDC at 6 dec) */
  fromAmount: string;
  /** Sender's wallet address (signs the tx) */
  fromAddress: `0x${string}`;
  /** Which token the recipient receives on Celo: "USDm" (18 dec) or "USDC" (6 dec) */
  toToken: SupportedDestToken;
  /** Recipient wallet address on Celo */
  toAddress: `0x${string}`;
};

export type BridgeTx = {
  to: `0x${string}`;
  data: `0x${string}`;
  value: string;
  chainId: number;
  gasLimit?: string;
  gasPrice?: string;
};

export type BridgeQuote = {
  id: string;
  tool: string;
  estimate: {
    fromAmount: string;
    toAmount: string;
    toAmountMin: string;
    executionDuration: number;
    feeCosts: { name: string; amountUSD: string }[];
    gasCosts: { amountUSD: string }[];
  };
  action: {
    fromChainId: number;
    toChainId: number;
    fromToken: { symbol: string; decimals: number };
    toToken: { symbol: string; decimals: number; address: string };
  };
  transactionRequest: BridgeTx;
};

export type BridgeStatusResult =
  | { status: "PENDING" | "FAILED" | "NOT_FOUND" }
  | { status: "DONE"; toTxHash: `0x${string}`; receivedAmount: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

function destTokenAddress(token: SupportedDestToken): string {
  return token === "USDm" ? CELO_USDM_ADDRESS : CELO_USDC_ADDRESS;
}

function lifiHeaders(): Record<string, string> {
  const h: Record<string, string> = { Accept: "application/json" };
  const key = process.env.LIFI_API_KEY?.trim();
  if (key) h["x-lifi-api-key"] = key;
  return h;
}

async function lifiGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${LIFI_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { headers: lifiHeaders() });
  if (!res.ok) {
    let detail = "";
    try { detail = ((await res.json()) as { message?: string }).message ?? ""; } catch { /* ignore */ }
    throw new Error(`LI.FI ${path} error ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

// ── Quote ─────────────────────────────────────────────────────────────────────

/**
 * Get a cross-chain bridge quote from any EVM chain to Celo.
 * Returns the transaction the user must sign on the source chain.
 */
export async function getBridgeQuote(params: BridgeQuoteParams): Promise<BridgeQuote> {
  return lifiGet<BridgeQuote>("/quote", {
    fromChain:    String(params.fromChainId),
    toChain:      String(CELO_CHAIN_ID),
    fromToken:    params.fromTokenAddress,
    toToken:      destTokenAddress(params.toToken),
    fromAmount:   params.fromAmount,
    fromAddress:  params.fromAddress,
    toAddress:    params.toAddress,
    integrator:   INTEGRATOR,
    allowBridges: "across,stargate,relay,cbridge",
  });
}

// ── Status polling ────────────────────────────────────────────────────────────

/**
 * Check the status of a bridge transaction after it has been broadcast.
 * Poll every ~15s until status === "DONE" or "FAILED".
 */
export async function getBridgeStatus(
  txHash: string,
  fromChainId: number,
): Promise<BridgeStatusResult> {
  type RawStatus = {
    status: string;
    receiving?: { txHash?: string; amount?: string };
  };

  let raw: RawStatus;
  try {
    raw = await lifiGet<RawStatus>("/status", {
      txHash,
      fromChain: String(fromChainId),
      toChain:   String(CELO_CHAIN_ID),
    });
  } catch {
    return { status: "NOT_FOUND" };
  }

  if (raw.status === "DONE") {
    return {
      status: "DONE",
      toTxHash: (raw.receiving?.txHash ?? "0x") as `0x${string}`,
      receivedAmount: raw.receiving?.amount ?? "0",
    };
  }
  if (raw.status === "FAILED") return { status: "FAILED" };
  return { status: "PENDING" };
}

// ── Human-readable summary ────────────────────────────────────────────────────

export function formatBridgeSummary(quote: BridgeQuote): string {
  const from = quote.action.fromToken;
  const to = quote.action.toToken;
  const received = (Number(quote.estimate.toAmountMin) / 10 ** to.decimals).toFixed(4);
  const durationMin = Math.ceil(quote.estimate.executionDuration / 60);
  const feeUsd = quote.estimate.feeCosts.reduce((s, f) => s + Number(f.amountUSD), 0).toFixed(2);
  const gasUsd = quote.estimate.gasCosts.reduce((s, g) => s + Number(g.amountUSD), 0).toFixed(2);

  return [
    `Bridge via ${quote.tool}`,
    `• You send:     ${(Number(quote.estimate.fromAmount) / 10 ** from.decimals).toFixed(4)} ${from.symbol} (chain ${quote.action.fromChainId})`,
    `• They receive: ≥${received} ${to.symbol} on Celo`,
    `• Bridge fee:   $${feeUsd}  |  Gas: $${gasUsd}`,
    `• Est. time:    ~${durationMin} min`,
  ].join("\n");
}
