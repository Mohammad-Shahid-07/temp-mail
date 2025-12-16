"use client"

import * as React from "react"
import { Ghost, Plus, ChevronDown, Trash2, Mail, Sparkles, Edit3, Check, X, Inbox, Zap, User, Copy, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MailProvider } from "@/lib/mail-provider"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface MailHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  email: string
  onCreateCustom: (username: string, domain: string) => Promise<void>
  onOpenCustomDialog?: () => void
  isScreenshotMode: boolean
  setIsScreenshotMode: (v: boolean) => void
  onOpenFakeID?: () => void
  onOpenPasswordGen?: () => void
  onOpenSidebar?: () => void
  currentProvider: MailProvider
  setProvider: (p: MailProvider) => void
  availableProviders: MailProvider[]
  accounts: { id: string; provider: string; address: string; token: string | null; fakeName?: string }[]
  currentAccountId: string | null
  onSwitchAccount: (id: string) => void
  onNewInbox: (provider?: MailProvider) => void
  onDeleteAccount?: (id: string) => void
}

const PROVIDER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Mail.tm": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  "1secmail": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  "Guerrilla": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "Mailsac": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" }
}

export function MailHeader({ 
  searchQuery, 
  setSearchQuery, 
  email, 
  onCreateCustom,
  onOpenCustomDialog,
  isScreenshotMode,
  setIsScreenshotMode,
  onOpenFakeID,
  onOpenPasswordGen,
  onOpenSidebar,
  currentProvider,
  setProvider,
  availableProviders,
  accounts,
  currentAccountId,
  onSwitchAccount,
  onNewInbox,
  onDeleteAccount
}: MailHeaderProps) {
  const [isInboxMenuOpen, setIsInboxMenuOpen] = React.useState(false)
  const [isNewInboxDialogOpen, setIsNewInboxDialogOpen] = React.useState(false)
  const [selectedProvider, setSelectedProvider] = React.useState<MailProvider>(currentProvider)
  const [isCopied, setIsCopied] = React.useState(false)

  const currentAccount = accounts.find(acc => acc.id === currentAccountId)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }
  
  const truncateEmail = (email: string, maxLength: number = 30) => {
    if (email.length <= maxLength) return email
    const [name, domain] = email.split('@')
    if (name.length > 15) {
      return `${name.substring(0, 12)}...@${domain}`
    }
    return email
  }

  const handleDeleteAccount = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDeleteAccount) {
      onDeleteAccount(id)
    }
  }

  const handleCreateNewInbox = async () => {
    setIsNewInboxDialogOpen(false)
    onNewInbox(selectedProvider)
  }

  const getProviderStyle = (providerName: string) => {
    return PROVIDER_COLORS[providerName] || { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/30" }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 bg-black/20 px-3 sm:px-6 py-3 backdrop-blur-md gap-3 sm:gap-4">
        {/* First Row (Mobile) / Left Side (Desktop) - Logo & Brand + Action Buttons + Hamburger */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 order-1 sm:order-1">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="h-10 w-10 bg-linear-to-br from-zinc-900 to-black border border-white/10 rounded-xl flex items-center justify-center relative z-10 group-hover:border-emerald-500/50 transition-colors">
            <Ghost className="h-5 w-5 text-emerald-400" />
          </div>
            <div>
              <h1 className="text-base font-bold text-white">GhostMail</h1>
              <p className="text-[10px] text-emerald-400/60 font-mono hidden sm:block">Temp • Secure • Anonymous</p>
            </div>
          </div>

          {/* Action Buttons + Hamburger (visible on mobile) */}
          <div className="flex items-center gap-1.5 sm:hidden shrink-0">
            <Button
              onClick={() => {
                setIsInboxMenuOpen(false)
                if (onOpenCustomDialog) onOpenCustomDialog()
              }}
              size="sm"
              variant="outline"
              className="gap-1.5 border-white/10 bg-white/5 text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 backdrop-blur-sm transition-all h-9 px-2 shrink-0"
            >
              <Edit3 className="h-3.5 w-3.5 shrink-0" />
            </Button>

            {onOpenFakeID && (
              <Button
                onClick={onOpenFakeID}
                size="sm"
                variant="outline"
                className="gap-1.5 border-white/10 bg-white/5 text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 backdrop-blur-sm transition-all h-9 px-2 shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
              </Button>
            )}

            {onOpenPasswordGen && (
              <Button
                onClick={onOpenPasswordGen}
                size="sm"
                variant="outline"
                className="gap-1.5 border-white/10 bg-white/5 text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 backdrop-blur-sm transition-all h-9 px-2 shrink-0"
              >
                <Zap className="h-3.5 w-3.5 shrink-0" />
              </Button>
            )}
            
            {onOpenSidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSidebar}
                className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-white/10 shrink-0"
                title="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Second Row (Mobile) / Center (Desktop) - Active Inbox Selector */}
        <div className="w-full sm:flex-1 sm:max-w-md order-2 sm:order-2">
          <Popover open={isInboxMenuOpen} onOpenChange={setIsInboxMenuOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="group h-auto w-full justify-between border-emerald-500/20 bg-emerald-500/5 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-sm hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border backdrop-blur-sm",
                    getProviderStyle(currentAccount?.provider || currentProvider.name).bg,
                    getProviderStyle(currentAccount?.provider || currentProvider.name).border
                  )}>
                    <Mail className={cn("h-4 w-4", getProviderStyle(currentAccount?.provider || currentProvider.name).text)} />
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                    <span className="text-sm font-mono text-white truncate flex-1">
                      {email}
                    </span>
                    <Badge className={cn(
                      "text-[8px] uppercase font-bold px-2 py-0.5 border-0 shrink-0",
                      getProviderStyle(currentAccount?.provider || currentProvider.name).bg,
                      getProviderStyle(currentAccount?.provider || currentProvider.name).text
                    )}>
                      {currentAccount?.provider || currentProvider.name}
                    </Badge>
                  </div>
                  
                  <motion.div
                    onClick={handleCopy}
                    whileTap={{ scale: 0.95 }}
                    className="ml-2 shrink-0 h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    title="Copy email"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
                  >
                    <AnimatePresence mode="wait">
                      {isCopied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Check className="h-4 w-4 text-emerald-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: -180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Copy className="h-4 w-4 text-zinc-400 group-hover:text-emerald-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
                
                <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </Button>
            </PopoverTrigger>
            
            <PopoverContent 
              className="w-[calc(100vw-2rem)] sm:w-104 border-emerald-500/20 bg-black/80 backdrop-blur-xl p-3 shadow-2xl shadow-emerald-500/10" 
              align="center"
              sideOffset={5}
            >
              {/* Header */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Active Inboxes</h3>
                  <p className="text-xs text-zinc-500">{accounts.length} {accounts.length === 1 ? 'inbox' : 'inboxes'}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsInboxMenuOpen(false)
                    setIsNewInboxDialogOpen(true)
                  }}
                  className="h-8 gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 backdrop-blur-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New
                </Button>
              </div>

              <Separator className="bg-emerald-500/10 mb-3" />

              {/* Accounts List */}
              <div className="max-h-87.5 space-y-2 overflow-y-auto">
                {accounts.map((account) => {
                  const isActive = account.id === currentAccountId
                  const style = getProviderStyle(account.provider)
                  
                  return (
                    <div
                      key={account.id}
                      onClick={() => {
                        onSwitchAccount(account.id)
                        setIsInboxMenuOpen(false)
                      }}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer transition-all backdrop-blur-sm",
                        isActive 
                          ? 'bg-emerald-500/20 border-emerald-500/40 shadow-lg shadow-emerald-500/20' 
                          : 'bg-white/5 border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10'
                      )}
                    >
                      <div className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border backdrop-blur-sm",
                        style.bg,
                        style.border
                      )}>
                        <Mail className={cn("h-4 w-4", style.text)} />
                      </div>
                      
                      <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                        {account.fakeName && (
                          <span className="flex items-center gap-1 text-xs text-emerald-400 mb-0.5 truncate">
                            <User className="h-2.5 w-2.5 shrink-0" />
                            {account.fakeName}
                          </span>
                        )}
                        <span className="text-xs font-mono text-white truncate">
                          {account.address}
                        </span>
                        <Badge className={cn("mt-1 w-fit text-[8px] uppercase font-bold px-1.5 py-0 border-0", style.bg, style.text)}>
                          {account.provider}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        {isActive && (
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/30 backdrop-blur-sm">
                            <Check className="h-3 w-3 text-emerald-400" />
                          </div>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => handleDeleteAccount(account.id, e)}
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
                
                {accounts.length === 0 && (
                  <div className="py-10 text-center">
                    <Ghost className="mx-auto h-12 w-12 text-zinc-700 mb-2" />
                    <p className="text-sm text-zinc-500">No inboxes yet</p>
                    <p className="text-xs text-zinc-700">Create your first inbox</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Side (Desktop only) - Action Buttons */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 order-3">
          <Button
            onClick={() => {
              setIsInboxMenuOpen(false)
              if (onOpenCustomDialog) onOpenCustomDialog()
            }}
            size="sm"
            variant="outline"
            className="gap-1.5 border-white/10 bg-white/5 text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 backdrop-blur-sm transition-all h-9 px-3 shrink-0"
          >
            <Edit3 className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs">Custom</span>
          </Button>

          {onOpenFakeID && (
            <Button
              onClick={onOpenFakeID}
              size="sm"
              variant="outline"
              className="gap-1.5 border-white/10 bg-white/5 text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 backdrop-blur-sm transition-all h-9 px-3 shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs">Fake ID</span>
            </Button>
          )}

          {onOpenPasswordGen && (
            <Button
              onClick={onOpenPasswordGen}
              size="sm"
              variant="outline"
              className="gap-1.5 border-white/10 bg-white/5 text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 backdrop-blur-sm transition-all h-9 px-3 shrink-0"
            >
              <Zap className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs">Password</span>
            </Button>
          )}
        </div>
      </div>

      {/* New Inbox Dialog */}
      <Dialog open={isNewInboxDialogOpen} onOpenChange={setIsNewInboxDialogOpen}>
        <DialogContent className="border-emerald-500/20 bg-black/80 backdrop-blur-xl text-white sm:max-w-md shadow-2xl shadow-emerald-500/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-emerald-400" />
              Create New Inbox
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm">
              Select a provider to create a temporary inbox with auto-generated fake identity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Mail Provider</Label>
              <div className="grid gap-2">
                {availableProviders.map((provider) => {
                  const isSelected = selectedProvider.name === provider.name
                  const style = getProviderStyle(provider.name)
                  
                  return (
                    <button
                      key={provider.name}
                      onClick={() => setSelectedProvider(provider)}
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-3 transition-all text-left backdrop-blur-sm",
                        isSelected
                          ? `${style.bg} ${style.border} border-2 shadow-lg`
                          : 'border-white/10 bg-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm",
                          style.bg,
                          style.border
                        )}>
                          <Mail className={cn("h-4 w-4", style.text)} />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{provider.name}</div>
                          <div className="text-xs text-zinc-500">
                            {provider.name === "Mail.tm" && "Fast • Reliable"}
                            {provider.name === "1secmail" && "Stable • Quick"}
                            {provider.name === "Guerrilla" && "Disposable"}
                            {provider.name === "Mailsac" && "Public • Instant"}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className={cn("h-4 w-4", style.text)} />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-300">
                  <span className="font-semibold text-emerald-400">Auto-Generated:</span> Each inbox includes a fake name and address for sign-ups.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsNewInboxDialogOpen(false)}
              className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewInbox}
              className="flex-1 bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-400 backdrop-blur-sm"
            >
              <Zap className="mr-1.5 h-4 w-4" />
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
