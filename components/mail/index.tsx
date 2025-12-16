"use client"

import * as React from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { MailHeader } from "./header"
import { MailSidebar } from "./sidebar"
import { MailList } from "./message-list"
import { MailDisplay } from "./message-display"
import { Message } from "./types"
import { mailApi, MessageSummary, mailTmProvider } from "@/lib/mail-tm"
import { oneSecMailProvider } from "@/lib/onesecmail"
import { guerrillaProvider } from "@/lib/guerrilla"
import { mailsacProvider } from "@/lib/mailsac"
import { MailProvider } from "@/lib/mail-provider"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import QRCode from "react-qr-code"
import { FakeIdentityDialog } from "./fake-identity-dialog"
import { PasswordGeneratorDialog } from "./password-generator-dialog"

// Helper to extract OTP
const extractOTP = (text: string): string | null => {
  if (!text) return null;
  // Look for common patterns: "code is 123456", "verification code: 1234", "OTP: 123456"
  const patterns = [
    /(?:code|pin|otp|verification|password|login)\s*(?:is|:|-)?\s*(\d{4,8})/i,
    /\b(\d{4,8})\b/ // Fallback: any 4-8 digit number (risky, but useful for short messages)
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Filter out common false positives like years (2023, 2024, 2025) if they appear in isolation
      const otp = match[1];
      if (otp.length === 4 && (otp.startsWith('19') || otp.startsWith('20'))) continue;
      return otp;
    }
  }
  return null;
}

export default function TempMailInterface() {
  // --- State ---
  const [email, setEmail] = React.useState("initializing_uplink...")
  const [isCopied, setIsCopied] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isBlur, setIsBlur] = React.useState(false)

  // Delete a message by id
  const handleDeleteMessage = React.useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessageId === id) setSelectedMessageId(null);
  }, [selectedMessageId]);
  const [token, setToken] = React.useState<string | null>(null)
  const [previousMessageCount, setPreviousMessageCount] = React.useState(0)
  const [isScreenshotMode, setIsScreenshotMode] = React.useState(false)
  const [currentProvider, setCurrentProvider] = React.useState<MailProvider>(mailTmProvider)
  const availableProviders = [mailTmProvider, oneSecMailProvider, guerrillaProvider, mailsacProvider]
  
  // Dialog States
  const [isCustomDialogOpen, setIsCustomDialogOpen] = React.useState(false)
  const [isQRDialogOpen, setIsQRDialogOpen] = React.useState(false)
  const [isFakeIDDialogOpen, setIsFakeIDDialogOpen] = React.useState(false)
  const [isPasswordGenDialogOpen, setIsPasswordGenDialogOpen] = React.useState(false)
  const [customUsername, setCustomUsername] = React.useState("")
  const [availableDomains, setAvailableDomains] = React.useState<any[]>([])

  // --- Initialization ---
  React.useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }

      try {
        const storedAccount = localStorage.getItem(`ghostmail_account_${currentProvider.name}`)
        const storedToken = localStorage.getItem(`ghostmail_token_${currentProvider.name}`)
        
        if (storedAccount && storedToken) {
          const acc = JSON.parse(storedAccount)
          setToken(storedToken)
          setEmail(acc.address)
        } else {
          await createNewAccount()
        }
      } catch (e) {
        console.error("Init failed:", e)
        // Fallback if local storage is corrupt
        await createNewAccount()
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [currentProvider])

  // --- Notifications ---
  React.useEffect(() => {
    if (messages.length > previousMessageCount && previousMessageCount > 0) {
       // Browser notification
       if ("Notification" in window && Notification.permission === "granted") {
         const newMsg = messages[0]; // Assuming new ones are at top or we just notify generic
         new Notification("New GhostMail", { 
           body: `Incoming transmission from ${newMsg?.sender || 'Unknown'}`,
           icon: '/icon.png' // Optional
         });
       }
       // Audio beep (Data URI for a simple futuristic blip)
       const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"); // Placeholder or real beep
       audio.play().catch(() => {}); 
    }
    setPreviousMessageCount(messages.length);
  }, [messages.length])

  // --- Polling ---
  React.useEffect(() => {
    if (!token) return
    
    const fetchMessages = async () => {
      try {
        // Determine lookup key based on provider
        let lookupKey = token;
        if (currentProvider.name === '1secmail' || currentProvider.name === 'Mailsac') {
          lookupKey = email;
        } else if (currentProvider.name === 'Guerrilla') {
          lookupKey = token; // Guerrilla uses sid_token
        }
        
        // Safety check
        if (!lookupKey) return;
        if ((currentProvider.name === '1secmail' || currentProvider.name === 'Mailsac') && !lookupKey.includes('@')) {
          return;
        }

        const apiMessages = await currentProvider.getMessages(lookupKey)
        
        // For Guerrilla, keep all previously seen messages in the UI for the session
        setMessages(prev => {
          // Map of id to message for quick lookup
          const prevMap = new Map(prev.map(m => [m.id, m]));
          // Update or add new messages from API
          apiMessages.forEach((m: any) => {
            const existing = prevMap.get(m.id);
            prevMap.set(m.id, {
              id: m.id,
              sender: m.from.name || m.from.address,
              email: m.from.address,
              subject: m.subject,
              time: new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              preview: m.intro,
              body: existing?.body && existing.body !== "Loading content..." ? existing.body : "Loading content...",
              read: m.seen,
              tag: (m.tag === 'spam' || m.tag === 'updates') ? m.tag : 'inbox',
              hasAttachments: m.hasAttachments,
              downloadUrl: m.downloadUrl,
              html: existing?.html,
              attachments: existing?.attachments,
              otp: existing?.otp || extractOTP(m.intro) || extractOTP(m.subject)
            } as Message);
          });
          // Return all messages ever seen in this session (do not remove missing ones)
          return Array.from(prevMap.values());
        });
      } catch (e) {
        console.error("Fetch failed:", e)
      }
    }
    
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [token, currentProvider, email])

  // --- Actions ---
  const handleOpenCustomDialog = async () => {
    setIsCustomDialogOpen(true);
    try {
      const data = await currentProvider.getDomains();
      // Handle different return formats if necessary, but providers should normalize
      setAvailableDomains(data.map((d: string) => ({ domain: d })));
    } catch (e) {
      console.error("Failed to fetch domains", e);
    }
  }

  const handleCreateCustomSubmit = async () => {
    if (!customUsername || !availableDomains[0]?.domain) return;
    try {
      await handleCreateCustomAccount(customUsername, availableDomains[0].domain);
      setIsCustomDialogOpen(false);
      setCustomUsername("");
    } catch (e) {
      console.error("Custom submit failed:", e);
    }
  }

  const createNewAccount = async () => {
    setIsLoading(true)
    try {
      // For 1secmail we don't need domains first, createAccount handles it
      // But for Mail.tm we might want to pick one? 
      // The provider implementation handles defaults.
      
      const acc = await currentProvider.createAccount();
      console.log("Account created:", acc);
      
      setToken(acc.token || acc.address) // 1secmail uses address as token effectively
      setEmail(acc.address)
      setMessages([])
      setSelectedMessageId(null)
      
      localStorage.setItem(`ghostmail_account_${currentProvider.name}`, JSON.stringify(acc))
      localStorage.setItem(`ghostmail_token_${currentProvider.name}`, acc.token || acc.address)
    } catch (e: any) {
      console.error("Create account failed:", e)
      setEmail(e.message?.substring(0, 20) || "connection_error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCustomAccount = async (username: string, domain: string) => {
    setIsLoading(true)
    try {
      const acc = await currentProvider.createAccount(username, domain)
      setToken(acc.token || acc.address)
      setEmail(acc.address)
      setMessages([])
      setSelectedMessageId(null)
      localStorage.setItem(`ghostmail_account_${currentProvider.name}`, JSON.stringify(acc))
      localStorage.setItem(`ghostmail_token_${currentProvider.name}`, acc.token || acc.address)
    } catch (e: any) {
      console.error("Custom account failed:", e)
      alert("Failed to create custom account. Username might be taken.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleRefresh = async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const lookupKey = currentProvider.name === '1secmail' ? email : token;
      const apiMessages = await currentProvider.getMessages(lookupKey)
      // Logic duplicated from effect, but that's fine for explicit refresh
      setMessages(prev => apiMessages.map((m: any) => {
        const existing = prev.find(p => p.id === m.id)
        return {
          id: m.id,
          sender: m.from.name || m.from.address,
          email: m.from.address,
          subject: m.subject,
          time: new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          preview: m.intro,
          body: existing?.body && existing.body !== "Loading content..." ? existing.body : "Loading content...",
          read: m.seen,
          tag: 'inbox',
          hasAttachments: m.hasAttachments,
          downloadUrl: m.downloadUrl
        }
      }))
      // Add a small artificial delay so the user sees the spinner
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBurn = () => {
    localStorage.removeItem(`ghostmail_account_${currentProvider.name}`)
    localStorage.removeItem(`ghostmail_token_${currentProvider.name}`)
    createNewAccount()
  }

  const handleSelectMessage = async (id: string | null) => {
    setSelectedMessageId(id)
    if (id && token) {
      const msg = messages.find(m => m.id === id)
      if (msg && msg.body === "Loading content...") {
        try {
          const lookupKey = currentProvider.name === '1secmail' ? email : token;
          const details = await currentProvider.getMessage(lookupKey, id)
          setMessages(prev => prev.map(m => 
            m.id === id ? { 
              ...m, 
              body: details.text || "No text content",
              html: details.html,
              attachments: details.attachments,
              downloadUrl: details.downloadUrl,
              otp: extractOTP(details.text) || m.otp
            } : m
          ))
        } catch (e) {
          console.error("Fetch details failed:", e)
        }
      }
    }
  }

  const filteredMessages = messages.filter(m => 
    m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedMessage = messages.find(m => m.id === selectedMessageId)

  return (
    <div className="h-screen w-full bg-[#030303] text-zinc-100 flex flex-col overflow-hidden font-sans selection:bg-emerald-500/30 relative">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,78,59,0.1),transparent_40%)] pointer-events-none" />
      
      {!isScreenshotMode && (
        <MailHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          email={email}
          onCreateCustom={handleCreateCustomAccount}
          isScreenshotMode={isScreenshotMode}
          setIsScreenshotMode={setIsScreenshotMode}
          currentProvider={currentProvider}
          setProvider={(p) => {
            setCurrentProvider(p);
            setMessages([]);
            setSelectedMessageId(null);
            setToken(null);
            setEmail("switching_uplink...");
          }}
          availableProviders={availableProviders}
        />
      )}

      {/* Screenshot Mode Exit Button */}
      {isScreenshotMode && (
        <div className="absolute top-4 right-4 z-50">
          <Button 
            onClick={() => setIsScreenshotMode(false)}
            className="bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/50 backdrop-blur-md"
          >
            Exit Zen Mode
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10 p-4 gap-4">
        
        {!isScreenshotMode && (
          <MailSidebar 
            onOpenFakeID={() => setIsFakeIDDialogOpen(true)}
            onOpenPasswordGen={() => setIsPasswordGenDialogOpen(true)}
          />
        )}

        <ResizablePanelGroup direction="horizontal" className="flex-1 gap-4">
          
          {/* Message List Panel */}
          {!isScreenshotMode && (
            <>
              <ResizablePanel defaultSize={35} minSize={25} maxSize={40} className="glass-panel rounded-2xl flex flex-col overflow-hidden">
                <MailList 
                  messages={filteredMessages}
                  selectedMessageId={selectedMessageId}
                  setSelectedMessageId={handleSelectMessage}
                  email={email}
                  isLoading={isLoading}
                  isCopied={isCopied}
                  isBlur={isBlur}
                  setIsBlur={setIsBlur}
                  handleCopy={handleCopy}
                  handleRefresh={handleRefresh}
                  handleBurn={handleBurn}
                  onOpenCustom={handleOpenCustomDialog}
                  onOpenQR={() => setIsQRDialogOpen(true)}
                />
              </ResizablePanel>

              <ResizableHandle className="bg-transparent w-4" />
            </>
          )}

          {/* Reading Pane */}
          <ResizablePanel defaultSize={65} className="glass-panel rounded-2xl flex flex-col relative overflow-hidden">
            <MailDisplay 
              selectedMessage={selectedMessage} 
              email={email} 
              onDelete={handleDeleteMessage}
              isScreenshotMode={isScreenshotMode}
              setIsScreenshotMode={setIsScreenshotMode}
              token={token}
              onOpenFakeID={() => setIsFakeIDDialogOpen(true)}
              onOpenPasswordGen={() => setIsPasswordGenDialogOpen(true)}
              currentProvider={currentProvider}
            />
          </ResizablePanel>
          
        </ResizablePanelGroup>
      </div>

      {/* Custom Address Dialog */}
      <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Create Custom Identity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="username" 
                  value={customUsername} 
                  onChange={(e) => setCustomUsername(e.target.value)}
                  className="bg-zinc-900 border-zinc-800" 
                  placeholder="batman"
                />
                <span className="text-zinc-500">@{availableDomains[0]?.domain || '...'}</span>
              </div>
            </div>
            <Button onClick={handleCreateCustomSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Initialize Identity
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 w-auto p-8 flex flex-col items-center gap-6 rounded-3xl shadow-2xl shadow-emerald-500/10">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold tracking-tight">Mobile Transfer</DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]">
            <QRCode value={email} size={200} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Scan to transfer identity</p>
            <p className="font-mono text-sm bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-emerald-400 select-all">{email}</p>
          </div>
        </DialogContent>
      </Dialog>
      <PasswordGeneratorDialog open={isPasswordGenDialogOpen} onOpenChange={setIsPasswordGenDialogOpen} />
      <FakeIdentityDialog open={isFakeIDDialogOpen} onOpenChange={setIsFakeIDDialogOpen} />
    </div>
  );
}
