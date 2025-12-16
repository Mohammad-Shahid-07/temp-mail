"use client"

import * as React from "react"
import { Archive, Trash2, Lock, Download, ExternalLink, Link as LinkIcon, Code, FileText, Paperclip, File, Globe, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Message } from "./types"
import { mailApi } from "@/lib/mail-tm"
import { cn } from "@/lib/utils"
import { FeaturesBento } from "./features-bento"
import { MailProvider } from "@/lib/mail-provider"

interface MailDisplayProps {
  selectedMessage: Message | undefined
  email: string
  onDelete?: (id: string) => void
  isScreenshotMode?: boolean
  setIsScreenshotMode?: (v: boolean) => void
  token?: string | null
  onOpenFakeID?: () => void
  onOpenPasswordGen?: () => void
  currentProvider: MailProvider
}

export function MailDisplay({ selectedMessage, email, onDelete, isScreenshotMode, token, onOpenFakeID, onOpenPasswordGen }: MailDisplayProps) {
  const [isSourceOpen, setIsSourceOpen] = React.useState(false)
  const [sourceCode, setSourceCode] = React.useState("")
  const [viewMode, setViewMode] = React.useState<'text' | 'html'>('text')

  // Reset view mode when message changes
  React.useEffect(() => {
    setViewMode('text')
  }, [selectedMessage?.id])

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

  const handleDownloadEML = () => {
    if (!selectedMessage?.downloadUrl) return;
    
    let url = selectedMessage.downloadUrl;
    // If relative and not my proxy, assume Mail.tm
    if (!url.startsWith('http') && !url.startsWith('/api')) {
      url = `https://api.mail.tm${url}`;
    }
    
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    fetch(url, { headers })
      .then(res => res.blob())
      .then(blob => {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(blob);
        element.download = `${selectedMessage.subject.replace(/[^a-z0-9]/gi, '_')}.eml`;
        document.body.appendChild(element);
        element.click();
      })
      .catch(e => console.error("Download failed", e));
  };

  const handleDownloadAttachment = (att: any) => {
    let url = att.downloadUrl;
    // If relative and not my proxy, assume Mail.tm
    if (!url.startsWith('http') && !url.startsWith('/api')) {
      url = `https://api.mail.tm${url}`;
    }

    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(url, { headers })
      .then(res => res.blob())
      .then(blob => {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(blob);
        element.download = att.filename;
        document.body.appendChild(element);
        element.click();
      })
      .catch(e => console.error("Download failed", e));
  };

  const handleViewSource = async () => {
    if (!selectedMessage || !token) return;
    setIsSourceOpen(true);
    setSourceCode("Loading source...");
    try {
      const data = await mailApi.getMessageSource(token, selectedMessage.id);
      setSourceCode(data.data || "No source available");
    } catch (e) {
      setSourceCode("Failed to load source.");
    }
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col relative overflow-hidden min-h-0">
        {selectedMessage ? (
          <motion.div 
            key={selectedMessage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col min-h-0"
          >
            {/* Message Toolbar */}
            {!isScreenshotMode && (
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
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download .txt</TooltipContent>
                  </Tooltip>
                  {selectedMessage.downloadUrl && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                          onClick={handleDownloadEML}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download .eml</TooltipContent>
                    </Tooltip>
                  )}
                  {selectedMessage.html && selectedMessage.html.length > 0 && (
                     <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("h-9 w-9 rounded-lg transition-colors", viewMode === 'html' ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-400 hover:text-white hover:bg-white/10")}
                          onClick={() => setViewMode(viewMode === 'text' ? 'html' : 'text')}
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle HTML View</TooltipContent>
                    </Tooltip>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                        onClick={handleViewSource}
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Source</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                  <Lock className="h-3 w-3" />
                  TLS 1.3 ENCRYPTED
                </div>
              </div>
            )}

            {/* Message Content */}
            <ScrollArea className="flex-1 h-0">
              <div className="p-6 md:p-10 max-w-4xl mx-auto">
                <div className="mb-10 pb-8 border-b border-white/5">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight text-glow break-words">{selectedMessage.subject}</h1>
                  <div className="flex items-start gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 shrink-0">
                      {selectedMessage.sender[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                        <span className="font-bold text-lg text-white truncate">{selectedMessage.sender}</span>
                        <span className="text-xs font-mono text-zinc-500 shrink-0">{selectedMessage.time}</span>
                      </div>
                      <div className="text-sm text-emerald-300 font-medium truncate">
                        {selectedMessage.email}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2 truncate">
                        to <span className="text-zinc-300 bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono truncate">{email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Link Extractor */}
                {selectedMessage.otp && (
                  <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-1 truncate">Verification Code Detected</span>
                      <span className="text-3xl font-bold text-white tracking-widest font-mono break-all">{selectedMessage.otp}</span>
                    </div>
                    <Button 
                      onClick={() => navigator.clipboard.writeText(selectedMessage.otp!)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shrink-0 w-full sm:w-auto"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                )}

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
                          className="flex items-center gap-3 p-3 rounded-lg bg-black/40 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all group min-w-0"
                        >
                          <div className="h-8 w-8 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                            <ExternalLink className="h-4 w-4" />
                          </div>
                          <span className="flex-1 text-sm text-zinc-300 truncate font-mono">{link}</span>
                          <Button size="sm" variant="ghost" className="text-xs h-7 shrink-0">Open</Button>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {viewMode === 'html' && selectedMessage.html ? (
                  <div className="bg-white rounded-lg overflow-hidden border border-white/10">
                    <iframe 
                      srcDoc={selectedMessage.html[0]} 
                      className="w-full h-[600px] bg-white" 
                      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                    />
                  </div>
                ) : (
                  <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap font-light break-words">
                    {selectedMessage.body}
                  </div>
                )}

                {/* Attachments */}
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2 text-zinc-400 mb-4 font-mono text-xs uppercase tracking-wider">
                      <Paperclip className="h-3 w-3" />
                      Attachments ({selectedMessage.attachments.length})
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedMessage.attachments.map((att: any) => (
                        <button 
                          key={att.id}
                          onClick={() => handleDownloadAttachment(att)}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group text-left w-full"
                        >
                          <div className="h-8 w-8 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                            <File className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-zinc-300 truncate font-medium">{att.filename}</div>
                            <div className="text-xs text-zinc-500 font-mono">{(att.size / 1024).toFixed(1)} KB</div>
                          </div>
                          <Download className="h-4 w-4 text-zinc-500 group-hover:text-white" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Source Code Dialog */}
            <Dialog open={isSourceOpen} onOpenChange={setIsSourceOpen}>
              <DialogContent className="max-w-5xl h-[80vh] bg-zinc-950 border-zinc-800 text-zinc-100 flex flex-col">
                <DialogHeader>
                  <DialogTitle>Message Source</DialogTitle>
                </DialogHeader>
                <div className="flex-1 bg-black/50 rounded-lg p-4 overflow-auto font-mono text-xs text-emerald-500/80 border border-white/5">
                  <pre>{sourceCode}</pre>
                </div>
              </DialogContent>
            </Dialog>

          </motion.div>
        ) : (
          <FeaturesBento 
            onOpenFakeID={onOpenFakeID}
            onOpenPasswordGen={onOpenPasswordGen}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
