"use client";
import { useState, useCallback, useRef } from "react";
import { chat } from "@/lib/agent";
import { sendTransaction, waitForTransaction } from "@/lib/wallet";
import type { Message, ChatResponse, EncodedTxJson } from "@/lib/types";

let _sessionId: string | null = null;
function getSessionId(): string {
  if (!_sessionId) _sessionId = `session_${Date.now()}`;
  return _sessionId;
}

export function useChat(walletAddress: string | null) {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const addMessage = useCallback((msg: Omit<Message, "id" | "timestamp">) => {
    const full: Message = { ...msg, id: crypto.randomUUID(), timestamp: new Date() };
    setMessages((prev) => [...prev, full]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    return full;
  }, []);

  const appendBotResponse = useCallback((response: ChatResponse) => {
    const botText = responseToText(response);
    addMessage({ role: "bot", text: botText, response });
  }, [addMessage]);

  const fetchAgentResponse = useCallback(async (text: string) => {
    if (!walletAddress) throw new Error("Wallet not connected");
    return chat(text, walletAddress, getSessionId());
  }, [walletAddress]);

  const send = useCallback(
    async (text: string) => {
      if (!walletAddress || loading) return;

      addMessage({ role: "user", text });
      setLoading(true);

      try {
        const response = await fetchAgentResponse(text);
        appendBotResponse(response);
      } catch (e) {
        addMessage({
          role: "bot",
          text: `⚠️ ${e instanceof Error ? e.message : "Something went wrong"}`,
        });
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, loading, addMessage, fetchAgentResponse, appendBotResponse],
  );

  /** Called when user taps Confirm on a draft card */
  const confirm = useCallback(async () => {
    await send("confirm");
  }, [send]);

  /** Called when user taps Cancel on a draft card */
  const cancel = useCallback(async () => {
    await send("cancel");
  }, [send]);

  async function continuePendingDraftAfterApproval() {
    addMessage({
      role: "bot",
      text: "✅ Approval confirmed. Preparing your payment transaction…",
    });

    try {
      const response = await fetchAgentResponse("confirm");
      if (response.type === "tx_ready") {
        await executeTransactions(response.tx.transactions, response.tx.token.symbol);
        return;
      }
      appendBotResponse(response);
    } catch (e) {
      addMessage({
        role: "bot",
        text:
          `⚠️ Approval succeeded, but I couldn't prepare the payment automatically: ` +
          `${e instanceof Error ? e.message : String(e)}.\n\nTap Confirm again to continue.`,
      });
    }
  }

  async function executeTransactions(
    transactions: EncodedTxJson[],
    tokenSymbol: string,
    options?: { continuePendingDraft?: boolean },
  ) {
    const hashes: string[] = [];
    for (const tx of transactions) {
      const hash = await sendTransaction(tx);
      hashes.push(hash);
      if (options?.continuePendingDraft) {
        await waitForTransaction(hash);
      }
    }

    if (options?.continuePendingDraft) {
      await continuePendingDraftAfterApproval();
      return;
    }

    const links = hashes
      .map((h) => `[View tx](https://celoscan.io/tx/${h})`)
      .join("\n");
    addMessage({
      role: "bot",
      text: `✅ Payment sent in ${tokenSymbol} from your wallet.\n\n${links}`,
    });
  }

  /** Sign and broadcast wallet transactions */
  const signAndSend = useCallback(
    async (
      transactions: EncodedTxJson[],
      tokenSymbol: string,
      options?: { continuePendingDraft?: boolean },
    ) => {
      setTxLoading(true);
      try {
        await executeTransactions(transactions, tokenSymbol, options);
      } catch (e) {
        addMessage({
          role: "bot",
          text: `❌ Transaction failed: ${e instanceof Error ? e.message : String(e)}`,
        });
      } finally {
        setTxLoading(false);
      }
    },
    [addMessage, executeTransactions],
  );

  const addBotMessage = useCallback((text: string) => {
    addMessage({ role: "bot", text });
  }, [addMessage]);

  return { messages, loading, txLoading, send, confirm, cancel, signAndSend, addBotMessage, bottomRef };
}

function responseToText(r: ChatResponse): string {
  switch (r.type) {
    case "clarify":  return r.question;
    case "info":     return r.message;
    case "cancelled":return r.message;
    case "draft":    return r.preview;
    case "tx_ready": return r.preview;
    default:         return "...";
  }
}
