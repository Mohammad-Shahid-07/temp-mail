"use client"

import * as React from "react"
import { Search, Settings, Ghost, Camera, User, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MailProvider } from "@/lib/mail-provider"

interface MailHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  email: string
  onCreateCustom: (username: string, domain: string) => Promise<void>
  isScreenshotMode: boolean
  setIsScreenshotMode: (v: boolean) => void
  onOpenFakeID?: () => void
  currentProvider: MailProvider
  setProvider: (p: MailProvider) => void
  availableProviders: MailProvider[]
}

export function MailHeader({ 
  searchQuery, 
  setSearchQuery, 
  email, 
  onCreateCustom,
  isScreenshotMode,
  setIsScreenshotMode,
  onOpenFakeID,
  currentProvider,
  setProvider,
  availableProviders
}: MailHeaderProps) {
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
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Encrypted Uplink</span>
            <span className="text-[10px] text-emerald-500/50">•</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-500 font-mono uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all">
                  {currentProvider.name}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-zinc-950 border-zinc-800 text-zinc-300 min-w-[140px]">
                {availableProviders.map(p => (
                  <DropdownMenuItem 
                    key={p.name} 
                    onClick={() => setProvider(p)}
                    className="hover:bg-zinc-900 hover:text-white cursor-pointer font-mono text-xs flex items-center justify-between group"
                  >
                    {p.name}
                    {currentProvider.name === p.name && (
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

      <div className="flex items-center gap-2">
        {/* Screenshot Mode */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl ${isScreenshotMode ? 'text-emerald-400 bg-emerald-500/10' : ''}`}
          onClick={() => setIsScreenshotMode(!isScreenshotMode)}
          title="Screenshot Mode"
        >
          <Camera className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
