"use client";

interface Recipient { username: string; address: string; amount: number; }

type DraftProps = {
  type: "draft"; recipients: Recipient[]; totalAmount: number;
  onConfirm: () => void; onCancel: () => void;
  tokenSymbol?: string; note?: string; txLoading?: boolean;
};

type ReadyProps = {
  type: "tx_ready"; recipients: Recipient[]; totalAmount: number;
  tokenSymbol: string; note: string;
  agentAddress?: string;
  agentRegistered?: boolean;
  onSign: () => void; txLoading: boolean;
};

type Props = DraftProps | ReadyProps;

export function TransactionCard(props: Props) {
  const { recipients, totalAmount, tokenSymbol = "USDm" } = props;

  return (
    <div className="w-full bg-cowry-card border border-cowry-blue/20 rounded-2xl overflow-hidden">
      {/* Header strip */}
      <div className="bg-gradient-to-r from-cowry-blue/10 to-cowry-purple/10 border-b border-cowry-border px-4 py-2.5 flex items-center gap-2">
        <span className="text-base">💳</span>
        <span className="text-xs font-semibold text-cowry-blue uppercase tracking-widest">
          {props.type === "draft" ? "Payment Preview" : "Ready to Sign"}
        </span>
      </div>

      {/* Recipients */}
      {recipients.length > 0 && (
        <div className="px-4 pt-3 space-y-2">
          {recipients.map((r, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-cowry-muted">
                {r.username.startsWith("@") ? r.username : `@${r.username}`}
              </span>
              <span className="font-semibold text-white">
                {r.amount.toLocaleString()} {tokenSymbol}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      {totalAmount > 0 && (
        <div className="mx-4 my-3 pt-2.5 border-t border-cowry-border flex justify-between text-sm">
          <span className="text-cowry-muted font-medium">Total</span>
          <span className="font-bold text-cowry-blue">
            {totalAmount.toLocaleString()} {tokenSymbol}
          </span>
        </div>
      )}

      {/* Note */}
      {props.type === "tx_ready" && props.note && (
        <p className="mx-4 mb-3 text-xs text-cowry-muted leading-relaxed">{props.note}</p>
      )}
      {props.type === "tx_ready" && props.agentAddress && (
        <p className="mx-4 mb-3 text-[10px] text-cowry-muted leading-relaxed">
          Cowry agent{" "}
          <a
            href={`https://celoscan.io/address/${props.agentAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cowry-blue hover:text-cowry-mint font-mono"
          >
            {props.agentAddress.slice(0, 6)}…{props.agentAddress.slice(-4)}
          </a>
          {props.agentRegistered
            ? " · ERC-8004 registered"
            : " · AI identity (you still sign & pay)"}
        </p>
      )}

      {/* Actions */}
      <div className="px-4 pb-4 mt-1 flex gap-2">
        {props.type === "draft" && (
          <>
            <button
              onClick={props.onConfirm}
              className="flex-1 bg-cowry-blue text-cowry-darker text-sm font-bold py-2.5 rounded-xl hover:bg-cowry-mint active:scale-95 transition-all"
            >
              Confirm ✓
            </button>
            <button
              onClick={props.onCancel}
              className="flex-1 bg-cowry-darker border border-cowry-border text-cowry-muted text-sm font-semibold py-2.5 rounded-xl hover:text-white hover:border-cowry-border/60 transition-all"
            >
              Cancel
            </button>
          </>
        )}
        {props.type === "tx_ready" && (
          <button
            onClick={props.onSign}
            disabled={props.txLoading}
            className="w-full bg-gradient-to-r from-cowry-blue to-cowry-mint text-cowry-darker text-sm font-bold py-2.5 rounded-xl active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {props.txLoading ? (
              <><Spinner /> Signing…</>
            ) : (
              "Sign & Send →"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
