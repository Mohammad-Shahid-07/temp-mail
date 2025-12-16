"use client"

import * as React from "react"
import { RefreshCw, Flame, Eye, EyeOff, Copy, Check, Inbox, QrCode, UserPlus, ExternalLink } from "lucide-react"
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
  onOpenCustom?: () => void
  onOpenQR?: () => void
  onBackupInbox?: () => void
  currentAccount?: { id: string; provider: string; address: string; token: string | null; fakeName?: string }
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
  handleBurn,
  onOpenCustom,
  onOpenQR,
  onBackupInbox,
  currentAccount
}: MailListProps) {
  const [showFakeName, setShowFakeName] = React.useState(true)
  const [isCopiedName, setIsCopiedName] = React.useState(false)
  
  const handleCopyName = () => {
    if (currentAccount?.fakeName) {
      navigator.clipboard.writeText(currentAccount.fakeName)
      setIsCopiedName(true)
      setTimeout(() => setIsCopiedName(false), 2000)
    }
  }
  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Identity Control */}
      <div className="p-2 sm:p-3 border-b border-white/5 space-y-2 bg-linear-to-b from-white/2 to-transparent shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Identity</span>
          {onBackupInbox && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 text-[10px] px-2 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-500/10"
              onClick={onBackupInbox}
            >
              Backup
            </Button>
          )}
        </div>
        
        {/* Identity Name */}
        {currentAccount?.fakeName && (
          <div className="flex items-center justify-between gap-2 bg-white/2 rounded-lg border border-white/5 p-2">
            <div className="flex-1 min-w-0">
              {showFakeName ? (
                <p className="text-xs font-semibold text-white truncate">
                  {currentAccount.fakeName}
                </p>
              ) : (
                <p className="text-xs font-semibold text-zinc-500">••••••••••••••</p>
              )}
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 hover:bg-white/10 hover:text-white rounded-lg"
                onClick={() => setShowFakeName(!showFakeName)}
                title={showFakeName ? "Hide name" : "Show name"}
              >
                {showFakeName ? (
                  <Eye className="h-3.5 w-3.5 text-zinc-400" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 hover:bg-emerald-500/20 hover:border hover:border-emerald-500/40 rounded-lg transition-all duration-200"
                onClick={handleCopyName}
                title="Copy name"
              >
                {isCopiedName ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                )}
              </Button>
            </div>
          </div>
        )}
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-green-500 rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-500" />
          <div className="relative bg-black/80 border border-white/10 rounded-lg p-1 flex items-center">
            <div className={cn("flex-1 px-2 font-mono text-xs text-zinc-300 truncate transition-all duration-300", isBlur && "blur-md select-none opacity-50")}>
              {email}
            </div>
            <div className="flex gap-0.5">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 hover:bg-white/10 hover:text-white rounded-lg"
                onClick={() => setIsBlur(!isBlur)}
              >
                {isBlur ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 hover:bg-white/10 hover:text-white rounded-lg"
                onClick={handleCopy}
              >
                {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            className="flex-1 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-zinc-300 h-8 text-xs px-2"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-3 w-3 sm:mr-2", isLoading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            className="bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-zinc-400 h-8 w-8"
            onClick={onOpenQR}
            title="Mobile QR"
          >
            <QrCode className="h-3.5 w-3.5" />
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            className="bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-zinc-400 h-8 w-8"
            onClick={onOpenCustom}
            title="Custom Address"
          >
            <UserPlus className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            className="bg-red-500/5 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 h-8 w-8"
            onClick={handleBurn}
            title="Burn Identity"
          >
            <Flame className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1 h-0 block!">
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
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "group flex flex-col items-start gap-1 p-4 rounded-xl text-left transition-all duration-300 border relative overflow-hidden cursor-pointer shrink-0 w-full",
                    selectedMessageId === msg.id 
                      ? "bg-white/10 border-white/10 shadow-lg" 
                      : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                  )}
                >
                  {selectedMessageId === msg.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
                  )}
                  <div className="flex w-full justify-between items-baseline mb-1 relative z-10 min-w-0">
                    <span className={cn("text-sm font-medium transition-colors truncate pr-2 flex-1", selectedMessageId === msg.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200")}>
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono shrink-0">{msg.time}</span>
                  </div>
                  <span className={cn("text-sm truncate w-full mb-1 relative z-10 block", selectedMessageId === msg.id ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-400")}>
                    {msg.subject}
                  </span>
                  <span className="text-xs text-zinc-600 truncate w-full relative z-10 group-hover:text-zinc-500 block">
                    {msg.preview}
                  </span>
                  {msg.actionLink && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 flex items-center justify-between gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-md w-full max-w-full relative z-10 overflow-hidden hover:bg-blue-500/20 transition-colors"
                    >
                      <a 
                        href={msg.actionLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 flex-1 min-w-0"
                      >
                        <ExternalLink className="h-3 w-3 text-blue-400 shrink-0" />
                        <span className="text-xs font-medium text-blue-400 truncate">{msg.actionLink.label}</span>
                      </a>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-5 w-5 text-blue-400 hover:text-white hover:bg-blue-500/20 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(msg.actionLink!.url);
                          }}
                          title="Copy link"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-5 w-5 text-blue-400 hover:text-white hover:bg-blue-500/20 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            window.open(msg.actionLink!.url, '_blank');
                          }}
                          title="Open link"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {msg.otp && (
                    <div className="mt-2 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1.5 rounded-md w-fit max-w-full group/otp relative z-10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-mono text-emerald-400 tracking-widest truncate min-w-0">OTP: {msg.otp}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 text-emerald-500 hover:text-white hover:bg-emerald-500/20 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(msg.otp!);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}
