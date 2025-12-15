"use client"

import * as React from "react"
import { RefreshCw, Flame, Eye, EyeOff, Copy, Check, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Message } from "./types"

interface MailListProps {
  messages: Message[]
  selectedMessageId: string | null
  setSelectedMessageId: (id: string | null) => void
  email: string
  isLoading: boolean
  isCopied: boolean
  isBlur: boolean
  setIsBlur: (blur: boolean) => void
  handleCopy: () => void
  handleRefresh: () => void
  handleBurn: () => void
}

export function MailList({
  messages,
  selectedMessageId,
  setSelectedMessageId,
  email,
  isLoading,
  isCopied,
  isBlur,
  setIsBlur,
  handleCopy,
  handleRefresh,
  handleBurn
}: MailListProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Identity Control */}
      <div className="p-6 border-b border-white/5 space-y-4 bg-linear-to-b from-white/2 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Identity</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-500">SECURE</span>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-green-500 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500" />
          <div className="relative bg-black/80 border border-white/10 rounded-xl p-1 flex items-center">
            <div className={cn("flex-1 px-3 font-mono text-sm text-zinc-300 truncate transition-all duration-300", isBlur && "blur-md select-none opacity-50")}>
              {email}
            </div>
            <div className="flex gap-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 hover:bg-white/10 hover:text-white rounded-lg"
                onClick={() => setIsBlur(!isBlur)}
              >
                {isBlur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 hover:bg-white/10 hover:text-white rounded-lg"
                onClick={handleCopy}
              >
                {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-zinc-300 h-9 text-xs uppercase tracking-wider font-medium transition-all"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-3 w-3 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            className="bg-red-500/5 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 h-9 text-xs uppercase tracking-wider font-medium transition-all group"
            onClick={handleBurn}
          >
            <Flame className="h-3 w-3 mr-2 group-hover:text-red-300" />
            Burn
          </Button>
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col p-2 gap-1">
          <AnimatePresence initial={false} mode="popLayout">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-700 gap-4">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                  <Inbox className="h-10 w-10 opacity-20" />
                </div>
                <p className="text-xs font-mono uppercase tracking-widest opacity-50">Void Empty</p>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.button
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={cn(
                    "group flex flex-col items-start gap-1 p-4 rounded-xl text-left transition-all duration-300 border relative overflow-hidden",
                    selectedMessageId === msg.id 
                      ? "bg-white/10 border-white/10 shadow-lg" 
                      : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                  )}
                >
                  {selectedMessageId === msg.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  )}
                  <div className="flex w-full justify-between items-baseline mb-1 relative z-10">
                    <span className={cn("text-sm font-medium transition-colors", selectedMessageId === msg.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200")}>
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono">{msg.time}</span>
                  </div>
                  <span className={cn("text-sm truncate w-full mb-1 relative z-10", selectedMessageId === msg.id ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-400")}>
                    {msg.subject}
                  </span>
                  <span className="text-xs text-zinc-600 truncate w-full relative z-10 group-hover:text-zinc-500">
                    {msg.preview}
                  </span>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}
