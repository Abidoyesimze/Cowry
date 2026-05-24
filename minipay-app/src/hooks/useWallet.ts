"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  isMiniPay,
  waitForProvider,
  requestAccounts,
  switchToCelo,
  shortAddress,
} from "@/lib/wallet";
import {
  getCachedUsername,
  getUsernameFromChain,
  isWalletRegistered,
  setCachedUsername,
} from "@/lib/registry";

type RegistrationState = "unknown" | "checking" | "unregistered" | "registered";

export function useWallet() {
  const [address,      setAddress]      = useState<`0x${string}` | null>(null);
  const [username,     setUsername]     = useState<string | null>(null);
  const [regState,     setRegState]     = useState<RegistrationState>("unknown");
  const [inMiniPay,    setInMiniPay]    = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [wrongChain,   setWrongChain]   = useState(false);
  const [walletError,  setWalletError]  = useState<string | null>(null);

  const hasAttempted = useRef(false);

  /** Fetch @name from chain in background (slow); never blocks the chat gate. */
  const fetchUsernameInBackground = useCallback((addr: `0x${string}`) => {
    void getUsernameFromChain(addr).then((name) => {
      if (name) {
        setCachedUsername(addr, name);
        setUsername(name);
      }
    });
  }, []);

  const checkRegistration = useCallback(async (addr: `0x${string}`) => {
    setRegState("checking");

    const cached = getCachedUsername(addr);
    if (cached) setUsername(cached);

    try {
      const registered = await isWalletRegistered(addr);
      if (!registered) {
        setUsername(null);
        setRegState("unregistered");
        return;
      }

      setRegState("registered");
      if (!cached) {
        fetchUsernameInBackground(addr);
      }
    } catch {
      setRegState("unknown");
    }
  }, [fetchUsernameInBackground]);

  const ensureCelo = useCallback(async () => {
    try {
      await switchToCelo();
      setWrongChain(false);
    } catch {
      setWrongChain(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (hasAttempted.current) return;
      hasAttempted.current = true;

      try {
        const ready = await waitForProvider(1500);
        if (!ready) {
          setWalletError("Please open this app inside MiniPay.");
          return;
        }

        const miniPay = isMiniPay();
        setInMiniPay(miniPay);

        if (!miniPay) {
          setWalletError("Please open this app inside MiniPay.");
          return;
        }

        const addr = await requestAccounts();
        if (!addr) {
          setWalletError("Connection failed. Unlock MiniPay and try again.");
          return;
        }

        setAddress(addr);
        // Unblock UI — registration check runs without holding the splash screen
        setIsConnecting(false);
        void checkRegistration(addr);
      } catch (e) {
        setWalletError(e instanceof Error ? e.message : String(e));
        setIsConnecting(false);
      }
    };

    init();

    type Provider = {
      on?:             (event: string, fn: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, fn: (...args: unknown[]) => void) => void;
    };
    const provider = (window as unknown as { ethereum?: Provider }).ethereum;

    const handleChainChange = (hexId: unknown) => {
      const id = parseInt(String(hexId), 16);
      setWrongChain(id !== 42220);
    };

    const handleAccountsChange = (accounts: unknown) => {
      const list = accounts as string[];
      const next = (list[0] ?? null) as `0x${string}` | null;
      setAddress(next);
      if (next) {
        void checkRegistration(next);
      } else {
        setUsername(null);
        setRegState("unknown");
      }
    };

    provider?.on?.("chainChanged",    handleChainChange);
    provider?.on?.("accountsChanged", handleAccountsChange);

    return () => {
      provider?.removeListener?.("chainChanged",    handleChainChange);
      provider?.removeListener?.("accountsChanged", handleAccountsChange);
    };
  }, [checkRegistration]);

  const onRegistered = useCallback((name: string) => {
    if (!address) return;
    setCachedUsername(address, name);
    setUsername(name);
    setRegState("registered");
  }, [address]);

  return {
    address,
    username,
    shortAddress:  address ? shortAddress(address) : null,
    inMiniPay,
    isConnecting,
    walletError,
    onRegistered,
    ensureCelo,
    wrongChain,
    isConnected:   !!address,
    isRegistered:  regState === "registered",
    isChecking:    regState === "checking",
  };
}
