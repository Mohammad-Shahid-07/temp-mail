"use client"

import * as React from "react"
import { 
  Copy, RefreshCw, Settings, History, Zap, 
  Trash2, Search, Inbox, 
  Star, Archive, Check,
  Flame, Ghost, Lock, Eye, EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// --- Types ---
type Message = {
  id: number
  sender: string
  email: string
  subject: string
  time: string
  preview: string
  body: string
  read: boolean
  tag?: 'inbox' | 'spam' | 'updates'
}

// --- Mock Data ---
const INITIAL_MESSAGES: Message[] = [
  { 
    id: 1, 
    sender: "GhostMail Prime", 
    email: "system@ghostmail.io",
    subject: "Secure Channel Established", 
    time: "00:01", 
    preview: "Your ephemeral identity is active. All systems nominal.",
    body: "Welcome to the void.\n\nYour identity is now shielded by our quantum-resistant encryption layer. This inbox is ephemeral, untraceable, and exists only as long as you need it.\n\nUse this address for:\n- Verification codes\n- One-time signups\n- Avoiding tracker pixels\n\nStay hidden.",
    read: false,
    tag: 'inbox'
  }
]

export default function TempMailInterface() {
  // --- State ---
  const [email, setEmail] = React.useState("initializing_uplink...")
  const [isCopied, setIsCopied] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES)
  const [selectedMessageId, setSelectedMessageId] = React.useState<number | null>(1)
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isBlur, setIsBlur] = React.useState(false)

  // --- Effects ---
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setEmail("spectre.v7@ghostmail.io")
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // --- Actions ---
  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (Math.random() > 0.5) {
        const newMsg: Message = {
          id: Date.now(),
          sender: "Unknown Source",
          email: "noreply@darkweb.net",
          subject: "Verification Required",
          time: "Now",
          preview: "Confirm your access code to proceed...",
          body: "Access Code: 882-192\n\nThis code will expire in 5 minutes. Do not share this with anyone.",
          read: false,
          tag: 'inbox'
        }
        setMessages(prev => [newMsg, ...prev])
      }
    }, 1000)
  }

  const handleBurn = () => {
    setIsLoading(true)
    setTimeout(() => {
      setEmail(`phantom.${Math.floor(Math.random() * 9999)}@ghostmail.io`)
      setMessages([])
      setSelectedMessageId(null)
      setIsLoading(false)
    }, 1200)
  }

  const filteredMessages = messages.filter(m => 
    m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedMessage = messages.find(m => m.id === selectedMessageId)

  return (
    <TooltipProvider>
      <div className="h-screen w-full bg-[#030303] text-zinc-100 flex flex-col overflow-hidden font-sans selection:bg-emerald-500/30 relative">
        
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,78,59,0.1),transparent_40%)] pointer-events-none" />
        
        {/* Header */}
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
            <div className="h-8 w-[1px] bg-white/10" />
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] border border-emerald-400/20 transition-all duration-300 hover:scale-105">
              <span className="mr-2">Upgrade</span>
              <Zap className="h-4 w-4 fill-current" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden relative z-10 p-4 gap-4">
          
          {/* Sidebar */}
          <nav className="w-[70px] glass-panel rounded-2xl flex flex-col items-center py-6 gap-4">
            <NavButton icon={Inbox} label="Inbox" active />
            <NavButton icon={Star} label="Starred" />
            <NavButton icon={History} label="History" />
            <NavButton icon={Archive} label="Archive" />
            <div className="mt-auto">
              <NavButton icon={Trash2} label="Trash" />
            </div>
          </nav>

          <ResizablePanelGroup direction="horizontal" className="flex-1 gap-4">
            
            {/* Message List Panel */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={45} className="glass-panel rounded-2xl flex flex-col overflow-hidden">
              
              {/* Identity Control */}
              <div className="p-6 border-b border-white/5 space-y-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Identity</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-500">SECURE</span>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500" />
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
                    {filteredMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-zinc-700 gap-4">
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                          <Inbox className="h-10 w-10 opacity-20" />
                        </div>
                        <p className="text-xs font-mono uppercase tracking-widest opacity-50">Void Empty</p>
                      </div>
                    ) : (
                      filteredMessages.map((msg) => (
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
            </ResizablePanel>

            <ResizableHandle className="bg-transparent w-4" />

            {/* Reading Pane */}
            <ResizablePanel defaultSize={65} className="glass-panel rounded-2xl flex flex-col relative overflow-hidden">
              {selectedMessage ? (
                <motion.div 
                  key={selectedMessage.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col"
                >
                  {/* Message Toolbar */}
                  <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.02]">
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg">
                            <Archive className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Archive</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                      <Lock className="h-3 w-3" />
                      TLS 1.3 ENCRYPTED
                    </div>
                  </div>

                  {/* Message Content */}
                  <ScrollArea className="flex-1">
                    <div className="p-10 max-w-4xl mx-auto">
                      <div className="mb-10 pb-8 border-b border-white/5">
                        <h1 className="text-3xl font-bold text-white mb-6 tracking-tight text-glow">{selectedMessage.subject}</h1>
                        <div className="flex items-start gap-5">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
                            {selectedMessage.sender[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between">
                              <span className="font-bold text-lg text-white">{selectedMessage.sender}</span>
                              <span className="text-xs font-mono text-zinc-500">{selectedMessage.time}</span>
                            </div>
                            <div className="text-sm text-emerald-300 font-medium">
                              {selectedMessage.email}
                            </div>
                            <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                              to <span className="text-zinc-300 bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono">{email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap font-light">
                        {selectedMessage.body}
                      </div>
                    </div>
                  </ScrollArea>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
                    <Ghost className="h-24 w-24 relative z-10 opacity-20" />
                  </div>
                  <p className="mt-8 text-sm font-mono uppercase tracking-[0.3em] opacity-50">Awaiting Transmission</p>
                </div>
              )}
            </ResizablePanel>
            
          </ResizablePanelGroup>
        </div>
      </div>
    </TooltipProvider>
  )
}

function NavButton({ icon: Icon, label, active }: { icon: React.ElementType, label: string, active?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group",
          active 
            ? "bg-emerald-600 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]" 
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
        )}>
          <Icon className={cn("h-6 w-6 transition-transform duration-300", active ? "scale-110" : "group-hover:scale-110")} />
          {active && <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-full opacity-50" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-black/90 border-white/10 text-xs font-mono uppercase tracking-widest">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

