"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Shield, KeyRound, User, Zap, Lock, Globe, ScanLine, Ghost, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto bg-black/20">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full mx-auto"
      >
        {/* Hero Card */}
        <motion.div 
          variants={item} 
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-zinc-900/80 to-black border border-white/5 p-8 md:p-10 flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-500 shadow-2xl shadow-black/50"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_70%)]" />
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
            <Ghost className="w-48 h-48 text-emerald-500" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              GhostMail <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Prime</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              Next-generation temporary email infrastructure. Military-grade encryption, zero-knowledge architecture, and instant disposability.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6 mt-12">
            <div className="flex items-center gap-3 text-zinc-300 group/item">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover/item:bg-emerald-500/20 transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Tracker Blocking</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300 group/item">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover/item:bg-emerald-500/20 transition-colors">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Instant Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300 group/item">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover/item:bg-emerald-500/20 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">TLS 1.3 Encrypted</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300 group/item">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover/item:bg-emerald-500/20 transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Multi-Region</span>
            </div>
          </div>
        </motion.div>

        {/* Password Generator */}
        <motion.div 
          variants={item} 
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-2 rounded-[2rem] bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-between hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-300 group cursor-pointer relative overflow-hidden"
          onClick={onOpenPasswordGen}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300 mb-6 shadow-lg">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Password Gen</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Create cryptographically secure passwords instantly with custom complexity rules.</p>
          </div>
          
          <div className="relative z-10 mt-6">
            <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Generate
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Fake Identity */}
        <motion.div 
          variants={item} 
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 rounded-[2rem] bg-zinc-900/50 border border-white/5 p-6 flex flex-col justify-between hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-300 group cursor-pointer relative overflow-hidden"
          onClick={onOpenFakeID}
        >
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="w-5 h-5 text-emerald-500 -rotate-45" />
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300">
              <User className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Fake ID</h3>
            <p className="text-xs text-zinc-500">Generate complete personas.</p>
          </div>
        </motion.div>

        {/* OTP Detector */}
        <motion.div 
          variants={item} 
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 rounded-[2rem] bg-zinc-900/50 border border-white/5 p-6 flex flex-col justify-between hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ScanLine className="w-24 h-24" />
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300">
              <ScanLine className="w-6 h-6" />
            </div>
            <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
              AI Powered
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">OTP Detector</h3>
            <p className="text-xs text-zinc-500">Auto-extracts verification codes.</p>
          </div>
        </motion.div>

        {/* Multi-Provider Info */}
        <motion.div 
          variants={item} 
          className="col-span-1 md:col-span-2 lg:col-span-2 rounded-[2rem] bg-zinc-900/50 border border-white/5 p-8 flex items-center justify-between hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300 shadow-lg">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">Multi-Provider Engine</h3>
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-sm text-zinc-500 max-w-xs">Seamlessly switch between Mail.tm, 1secmail, and other providers for maximum flexibility.</p>
            </div>
          </div>
          
          <div className="flex -space-x-4 relative z-10">
            <div className="h-12 w-12 rounded-full bg-zinc-900 border-4 border-black flex items-center justify-center text-xs font-bold text-zinc-400 shadow-xl transform group-hover:translate-x-2 transition-transform duration-300">M</div>
            <div className="h-12 w-12 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center text-xs font-bold text-zinc-300 shadow-xl transform group-hover:translate-x-0 transition-transform duration-300 z-10">1</div>
            <div className="h-12 w-12 rounded-full bg-emerald-900 border-4 border-black flex items-center justify-center text-xs font-bold text-emerald-400 shadow-xl transform group-hover:-translate-x-2 transition-transform duration-300 z-20">+</div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}