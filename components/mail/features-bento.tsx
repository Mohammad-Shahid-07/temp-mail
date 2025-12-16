"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Shield, KeyRound, User, Zap, Lock, Globe, ScanLine, Ghost, Server, Fingerprint, Bell, QrCode, Layers } from "lucide-react"

interface FeaturesBentoProps {
  onOpenFakeID?: () => void
  onOpenPasswordGen?: () => void
}

import type { Variants } from "framer-motion"

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
}

export function FeaturesBento({ onOpenFakeID, onOpenPasswordGen }: FeaturesBentoProps) {
  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#05070c] px-3 py-3">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.08),transparent_35%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-2 md:grid-cols-12 md:auto-rows-[minmax(100px,auto)]"
      >
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-[#0c1724] via-[#0a101a] to-[#080b14] p-4 md:col-span-7 shadow-[0_12px_40px_-30px_rgba(16,185,129,0.55)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,197,94,0.2),transparent_40%)]" />
          <div className="absolute right-4 top-4 text-emerald-200/20">
            <Ghost className="h-10 w-10" />
          </div>

          <div className="relative flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-100">
              GhostMail Console
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold leading-tight text-white">
                Keep burner identities sharp, fast, and clean.
              </h2>
              <p className="max-w-2xl text-xs text-zinc-400">
                Smart CTAs for verify/reset links, live polling, and a provider mesh you can swap without losing flow.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[{
                icon: <Shield className="h-3.5 w-3.5" />, label: "Tracker shields", meta: "Pixels scrubbed"
              }, {
                icon: <Zap className="h-3.5 w-3.5" />, label: "5s polling", meta: "Real-time"
              }, {
                icon: <Lock className="h-3.5 w-3.5" />, label: "TLS enforced", meta: "UI + provider"
              }, {
                icon: <Globe className="h-3.5 w-3.5" />, label: "Provider mesh", meta: "Multi-source"
              }].map((stat, i) => (
                <div key={i} className="group flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2 py-1.5 transition duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-200">
                    {stat.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white">{stat.label}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{stat.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="relative flex h-full flex-col gap-2 overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[#10162a] via-[#0d1220] to-[#0b0f19] p-4 md:col-span-5 shadow-[0_8px_24px_-20px_rgba(99,102,241,0.5)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.12),transparent_40%)]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-indigo-200/70">Identity Lab</p>
              <h3 className="mt-0.5 text-base font-semibold text-white">Spin fresh personas</h3>
            </div>
            <Layers className="h-8 w-8 text-indigo-200/50" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button onClick={onOpenFakeID} className="group flex flex-col gap-1.5 rounded-xl border border-white/5 bg-white/5 p-3 text-left transition hover:border-emerald-400/40 hover:bg-emerald-500/5 hover:scale-[1.02]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-200">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Fake identity</div>
                <div className="text-[10px] text-zinc-500">Persona packs</div>
              </div>
            </button>

            <button onClick={onOpenPasswordGen} className="group flex flex-col gap-1.5 rounded-xl border border-white/5 bg-white/5 p-3 text-left transition hover:border-cyan-400/40 hover:bg-cyan-500/5 hover:scale-[1.02]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/12 text-cyan-200">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Password forge</div>
                <div className="text-[10px] text-zinc-500">Entropy first</div>
              </div>
            </button>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-1.5 text-[11px] text-zinc-400">
            <div className="rounded-lg border border-white/5 bg-white/5 px-2 py-1.5">
              <div className="flex items-center gap-1.5 text-emerald-200">
                <Shield className="h-3 w-3" />
                <span className="text-xs font-semibold text-white">No reuse</span>
              </div>
              <p className="mt-0.5 text-[9px] text-zinc-500">Unique creds</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 px-2 py-1.5">
              <div className="flex items-center gap-1.5 text-cyan-200">
                <Fingerprint className="h-3 w-3" />
                <span className="text-xs font-semibold text-white">Low print</span>
              </div>
              <p className="mt-0.5 text-[9px] text-zinc-500">Neutral names</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0b101d] p-3 md:col-span-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.12),transparent_40%)]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-200/70">Smart actions</p>
              <h3 className="mt-0.5 text-sm font-semibold text-white">One-tap verify & reset</h3>
            </div>
            <Bell className="h-7 w-7 text-emerald-200/50" />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs text-zinc-300">
            <div className="rounded-lg border border-white/5 bg-white/5 px-2 py-1.5">
              <div className="flex items-center gap-1.5 text-emerald-200"><ScanLine className="h-3 w-3" /><span className="text-xs font-medium">OTP extraction</span></div>
              <p className="mt-0.5 text-[9px] text-zinc-500">Auto-detect codes</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 px-2 py-1.5">
              <div className="flex items-center gap-1.5 text-emerald-200"><QrCode className="h-3 w-3" /><span className="text-xs font-medium">Device handoff</span></div>
              <p className="mt-0.5 text-[9px] text-zinc-500">QR transfer</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0d111c] p-3 md:col-span-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.12),transparent_38%)]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-blue-200/70">Delivery spine</p>
              <h3 className="mt-0.5 text-sm font-semibold text-white">Provider mesh + fallbacks</h3>
            </div>
            <Server className="h-7 w-7 text-blue-200/50" />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-zinc-300">
            {["Mail.tm", "1secmail", "Mailsac", "Guerrilla"].map((p) => (
              <span key={p} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-semibold text-white/80">
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0c0f18] p-3 md:col-span-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(244,244,245,0.08),transparent_40%)]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-200/70">Receipts</p>
              <h3 className="mt-0.5 text-sm font-semibold text-white">Proof-friendly backups</h3>
            </div>
            <Lock className="h-7 w-7 text-zinc-300/50" />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[9px] text-zinc-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">JSON export</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">Local-only</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">One-click burn</span>
          </div>
        </motion.div>

          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0b1018] p-3 md:col-span-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.1),transparent_45%)]" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-200/70">Stealth layer</p>
                <h3 className="mt-0.5 text-sm font-semibold text-white">Image + tracker control</h3>
              </div>
              <Shield className="h-7 w-7 text-emerald-200/50" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] text-zinc-300">
              <span className="rounded-lg border border-white/5 bg-white/5 px-2 py-1.5">Image block</span>
              <span className="rounded-lg border border-white/5 bg-white/5 px-2 py-1.5">Zen mode</span>
            </div>
          </motion.div>
      </motion.div>
    </div>
  )
}