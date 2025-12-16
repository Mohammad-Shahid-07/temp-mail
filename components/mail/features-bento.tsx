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

// Border Spotlight Card Component
function BorderSpotlightCard({ children, className, color }: { children: React.ReactNode, className?: string, color: string }) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative ${className}`}
    >
      {/* Spotlight border effect */}
      {isHovering && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle 80px at ${mousePosition.x}px ${mousePosition.y}px, ${
              color === 'emerald' ? 'rgba(16,185,129,0.6)' :
              color === 'indigo' ? 'rgba(99,102,241,0.6)' :
              color === 'cyan' ? 'rgba(34,211,238,0.6)' :
              color === 'blue' ? 'rgba(59,130,246,0.6)' :
              color === 'purple' ? 'rgba(168,85,247,0.6)' :
              'rgba(236,72,153,0.6)'
            }, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, 
              linear-gradient(to right, black 0%, transparent 70%),
              linear-gradient(to left, black 0%, transparent 70%),
              linear-gradient(to top, black 0%, transparent 70%),
              linear-gradient(to bottom, black 0%, transparent 70%)
            )`,
            maskImage: `linear-gradient(to bottom, 
              linear-gradient(to right, black 0%, transparent 70%),
              linear-gradient(to left, black 0%, transparent 70%),
              linear-gradient(to top, black 0%, transparent 70%),
              linear-gradient(to bottom, black 0%, transparent 70%)
            )`,
          } as React.CSSProperties}
        />
      )}
      {children}
    </div>
  )
}

export function FeaturesBento({ onOpenFakeID, onOpenPasswordGen }: FeaturesBentoProps) {
  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#030303] px-3 py-3">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.06),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.06),transparent_35%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-2 md:grid-cols-12 md:auto-rows-[minmax(100px,auto)]"
      >
        <motion.div
          variants={item}
          className="md:col-span-7"
        >
          <BorderSpotlightCard color="emerald" className="relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-4 shadow-[0_8px_32px_rgba(16,185,129,0.08)] transition-all duration-500 hover:border-emerald-500/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.4),0_8px_32px_rgba(16,185,129,0.15)]">
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,197,94,0.08),transparent_40%)]" />
              <div className="absolute right-4 top-4 text-emerald-300/30">
                <Ghost className="h-10 w-10" />
              </div>

              <div className="relative flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-200">
                  GhostMail Console
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
                    <div key={i} className="group flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1.5 transition duration-300 hover:border-emerald-400/60 hover:bg-emerald-500/20">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/30 text-emerald-300">
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
            </div>
          </BorderSpotlightCard>
        </motion.div>

        <motion.div
          variants={item}
          className="md:col-span-5"
        >
          <BorderSpotlightCard color="indigo" className="relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-4 shadow-[0_8px_32px_rgba(99,102,241,0.08)] transition-all duration-500 hover:border-indigo-500/60 hover:shadow-[0_0_24px_rgba(99,102,241,0.4),0_8px_32px_rgba(99,102,241,0.15)]">
            <div className="relative flex h-full flex-col gap-2">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.1),transparent_40%)]" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-indigo-300/70">Identity Lab</p>
                  <h3 className="mt-0.5 text-base font-semibold text-white">Spin fresh personas</h3>
                </div>
                <Layers className="h-8 w-8 text-indigo-300/50" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={onOpenFakeID} className="group flex flex-col gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-left transition hover:border-indigo-400/60 hover:bg-indigo-500/20 hover:scale-[1.02]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-300">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Fake identity</div>
                    <div className="text-[10px] text-zinc-500">Persona packs</div>
                  </div>
                </button>

                <button onClick={onOpenPasswordGen} className="group flex flex-col gap-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-left transition hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:scale-[1.02]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/30 text-cyan-300">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Password forge</div>
                    <div className="text-[10px] text-zinc-500">Entropy first</div>
                  </div>
                </button>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-1.5 text-[11px] text-zinc-400">
                <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2 py-1.5">
                  <div className="flex items-center gap-1.5 text-indigo-300">
                    <Shield className="h-3 w-3" />
                    <span className="text-xs font-semibold text-white">No reuse</span>
                  </div>
                  <p className="mt-0.5 text-[9px] text-zinc-500">Unique creds</p>
                </div>
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-1.5">
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <Fingerprint className="h-3 w-3" />
                    <span className="text-xs font-semibold text-white">Low print</span>
                  </div>
                  <p className="mt-0.5 text-[9px] text-zinc-500">Neutral names</p>
                </div>
              </div>
            </div>
          </BorderSpotlightCard>
        </motion.div>

        <motion.div
          variants={item}
          className="md:col-span-6"
        >
          <BorderSpotlightCard color="emerald" className="relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-3 shadow-[0_8px_32px_rgba(16,185,129,0.08)] transition-all duration-500 hover:border-emerald-500/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.4),0_8px_32px_rgba(16,185,129,0.15)]">
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.1),transparent_40%)]" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-300/70">Smart actions</p>
                  <h3 className="mt-0.5 text-sm font-semibold text-white">One-tap verify & reset</h3>
                </div>
                <Bell className="h-7 w-7 text-emerald-300/50" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs text-zinc-300">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-300"><ScanLine className="h-3 w-3" /><span className="text-xs font-medium">OTP extraction</span></div>
                  <p className="mt-0.5 text-[9px] text-zinc-500">Auto-detect codes</p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-300"><QrCode className="h-3 w-3" /><span className="text-xs font-medium">Device handoff</span></div>
                  <p className="mt-0.5 text-[9px] text-zinc-500">QR transfer</p>
                </div>
              </div>
            </div>
          </BorderSpotlightCard>
        </motion.div>

        <motion.div
          variants={item}
          className="md:col-span-6"
        >
          <BorderSpotlightCard color="blue" className="relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-3 shadow-[0_8px_32px_rgba(59,130,246,0.08)] transition-all duration-500 hover:border-blue-500/60 hover:shadow-[0_0_24px_rgba(59,130,246,0.4),0_8px_32px_rgba(59,130,246,0.15)]">
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.1),transparent_38%)]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-blue-300/70">Delivery spine</p>
                  <h3 className="mt-0.5 text-sm font-semibold text-white">Provider mesh + fallbacks</h3>
                </div>
                <Server className="h-7 w-7 text-blue-300/50" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-zinc-300">
                {["Mail.tm", "1secmail", "Mailsac", "Guerrilla"].map((p) => (
                  <span key={p} className="rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-0.5 font-semibold text-blue-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </BorderSpotlightCard>
        </motion.div>

        <motion.div
          variants={item}
          className="md:col-span-6"
        >
          <BorderSpotlightCard color="purple" className="relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-3 shadow-[0_8px_32px_rgba(168,85,247,0.08)] transition-all duration-500 hover:border-purple-500/60 hover:shadow-[0_0_24px_rgba(168,85,247,0.4),0_8px_32px_rgba(168,85,247,0.15)]">
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(168,85,247,0.08),transparent_40%)]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-purple-300/70">Receipts</p>
                  <h3 className="mt-0.5 text-sm font-semibold text-white">Proof-friendly backups</h3>
                </div>
                <Lock className="h-7 w-7 text-purple-300/50" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[9px] text-zinc-400">
                <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2.5 py-0.5 text-purple-200">JSON export</span>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2.5 py-0.5 text-purple-200">Local-only</span>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2.5 py-0.5 text-purple-200">One-click burn</span>
              </div>
            </div>
          </BorderSpotlightCard>
        </motion.div>

          <motion.div
            variants={item}
            className="md:col-span-6"
          >
            <BorderSpotlightCard color="pink" className="relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[#0d0d0d] to-[#080808] p-3 shadow-[0_8px_32px_rgba(236,72,153,0.08)] transition-all duration-500 hover:border-pink-500/60 hover:shadow-[0_0_24px_rgba(236,72,153,0.4),0_8px_32px_rgba(236,72,153,0.15)]">
              <div className="relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(236,72,153,0.1),transparent_45%)]" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-pink-300/70">Stealth layer</p>
                    <h3 className="mt-0.5 text-sm font-semibold text-white">Image + tracker control</h3>
                  </div>
                  <Shield className="h-7 w-7 text-pink-300/50" />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] text-zinc-300">
                  <span className="rounded-lg border border-pink-500/20 bg-pink-500/10 px-2 py-1.5 text-pink-200">Image block</span>
                  <span className="rounded-lg border border-pink-500/20 bg-pink-500/10 px-2 py-1.5 text-pink-200">Zen mode</span>
                </div>
              </div>
            </BorderSpotlightCard>
          </motion.div>
      </motion.div>
    </div>
  )
}