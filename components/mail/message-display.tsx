"use client"

import * as React from "react"
import { Archive, Trash2, Lock, Ghost, Download, ExternalLink, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { Message } from "./types"

interface MailDisplayProps {
  selectedMessage: Message | undefined
  email: string
  onDelete?: (id: string) => void
}

export function MailDisplay({ selectedMessage, email, onDelete }: MailDisplayProps) {
  const links = React.useMemo(() => {
    if (!selectedMessage?.body) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const found = selectedMessage.body.match(urlRegex) || [];
    return [...new Set(found)]; // Deduplicate
  }, [selectedMessage]);

  const handleDownload = () => {
    if (!selectedMessage) return;
    const element = document.createElement("a");
    const file = new Blob([selectedMessage.body], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedMessage.subject.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col relative overflow-hidden">
        {selectedMessage ? (
          <motion.div 
            key={selectedMessage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col"
          >
            {/* Message Toolbar */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/2">
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      onClick={() => onDelete?.(selectedMessage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download .txt</TooltipContent>
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
                    <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
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

                {/* Smart Link Extractor */}
                {links.length > 0 && (
                  <div className="mb-8 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-400 mb-3 font-mono text-xs uppercase tracking-wider">
                      <LinkIcon className="h-3 w-3" />
                      Detected Links
                    </div>
                    <div className="space-y-2">
                      {links.map((link, i) => (
                        <a 
                          key={i} 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-black/40 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all group"
                        >
                          <div className="h-8 w-8 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <ExternalLink className="h-4 w-4" />
                          </div>
                          <span className="flex-1 text-sm text-zinc-300 truncate font-mono">{link}</span>
                          <Button size="sm" variant="ghost" className="text-xs h-7">Open</Button>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
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
      </div>
    </TooltipProvider>
  )
}
