"use client";
import { useEffect } from "react";

interface Command {
  label:    string;
  template: string;
  desc:     string;
}

interface Category {
  icon:     string;
  title:    string;
  commands: Command[];
}

const CATEGORIES: Category[] = [
  {
    icon: "💸",
    title: "Payments",
    commands: [
      { label: "Send USDC",        template: "Send 10 USDC to @",            desc: "Pay with Circle USDC on Celo" },
      { label: "Send USDm",        template: "Send 10 USDm to @",            desc: "Pay with Mento USDm on Celo" },
      { label: "Split among people", template: "Split 30 USDC among @alice, @bob", desc: "Divide equally (USDC or USDm)" },
      { label: "Send to group",    template: "Send 20 USDC to everyone in ", desc: "Same amount per member" },
      { label: "Split across group", template: "Split 100 USDC across group ", desc: "Divide total across group" },
    ],
  },
  {
    icon: "👥",
    title: "Groups",
    commands: [
      { label: "List my groups",   template: "list my groups",                        desc: "See all your groups and members" },
      { label: "Create group",     template: "Create group  with @alice, @bob",       desc: "Create a named payment group" },
      { label: "Add to group",     template: "Add @alice to group ",                  desc: "Add a member to an existing group" },
      { label: "Remove from group",template: "Remove @alice from group ",             desc: "Remove a member from a group" },
      { label: "Cancel group",     template: "Cancel group ",                         desc: "Delete a group (use group ID)" },
    ],
  },
  {
    icon: "💰",
    title: "Tokens & Account",
    commands: [
      { label: "My balance",       template: "My balance",                            desc: "Check your USDm and USDC balance" },
      { label: "Approve USDm",     template: "Approve 500 USDm for Cowry",            desc: "Allow CowryPay to spend your USDm" },
      { label: "Approve USDC",     template: "Approve 500 USDC for Cowry",            desc: "Allow CowryPay to spend your USDC" },
      { label: "Register username",template: "Register as ",                          desc: "Claim a unique @username on-chain" },
    ],
  },
  {
    icon: "↗️",
    title: "Cross-chain send",
    commands: [
      { label: "Send to another chain", template: "",                                  desc: "Celo USDC/USDm → USDC on Ethereum, Base, Arbitrum, etc." },
    ],
  },
  {
    icon: "ℹ️",
    title: "Help",
    commands: [
      { label: "Show all commands", template: "help",                                desc: "Get the full command reference" },
      { label: "My transactions",   template: "My transactions",                     desc: "View recent payment history" },
    ],
  },
];

interface Props {
  onSelect: (template: string) => void;
  onClose:  () => void;
}

export function CommandMenu({ onSelect, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Sheet */}
      <div
        className="bg-cowry-dark border-t border-cowry-border rounded-t-3xl overflow-hidden max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + title */}
        <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-cowry-border">
          <div className="w-10 h-1 bg-cowry-border rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Commands</h2>
            <button
              onClick={onClose}
              className="text-cowry-muted hover:text-white text-xs px-2 py-1 transition-colors"
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-4 pb-6 pt-2 space-y-5">
          {CATEGORIES.map((cat) => (
            <div key={cat.title}>
              {/* Category header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{cat.icon}</span>
                <span className="text-xs font-semibold text-cowry-blue uppercase tracking-widest">
                  {cat.title}
                </span>
              </div>

              {/* Commands */}
              <div className="space-y-1.5">
                {cat.commands.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => { onSelect(cmd.template); onClose(); }}
                    disabled={!cmd.template}
                    className="w-full flex items-center justify-between gap-3 bg-cowry-card hover:bg-cowry-card/70 border border-cowry-border hover:border-cowry-blue/30 rounded-xl px-4 py-3 text-left transition-all group disabled:opacity-40 disabled:cursor-default"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-cowry-blue transition-colors">
                        {cmd.label}
                      </p>
                      <p className="text-xs text-cowry-muted mt-0.5 truncate">{cmd.desc}</p>
                    </div>
                    {cmd.template && (
                      <span className="text-cowry-border group-hover:text-cowry-blue transition-colors flex-shrink-0 text-xs">
                        →
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
