"use client"

import * as React from "react"
import { Search, Settings, Ghost } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MailHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function MailHeader({ searchQuery, setSearchQuery }: MailHeaderProps) {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-xl z-50 relative">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="h-10 w-10 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl flex items-center justify-center relative z-10 group-hover:border-emerald-500/50 transition-colors">
            <Ghost className="h-5 w-5 text-emerald-400" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">GhostMail</span>
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Encrypted Uplink</span>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-black/40 rounded-full px-4 py-2 border border-white/5 w-96 shadow-inner focus-within:border-emerald-500/50 focus-within:bg-black/60 transition-all duration-300">
        <Search className="h-4 w-4 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search encrypted messages..." 
          className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-zinc-600 text-zinc-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
