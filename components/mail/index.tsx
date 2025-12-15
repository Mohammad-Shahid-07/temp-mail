"use client"

import * as React from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { MailHeader } from "./header"
import { MailSidebar } from "./sidebar"
import { MailList } from "./message-list"
import { MailDisplay } from "./message-display"
import { Message } from "./types"
import { mailApi, MessageSummary } from "@/lib/mail-tm"

export default function TempMailInterface() {
  // --- State ---
  const [email, setEmail] = React.useState("initializing_uplink...")
  const [isCopied, setIsCopied] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isBlur, setIsBlur] = React.useState(false)
  const [token, setToken] = React.useState<string | null>(null)
  const [previousMessageCount, setPreviousMessageCount] = React.useState(0)
  const [isScreenshotMode, setIsScreenshotMode] = React.useState(false)

  // --- Initialization ---
  React.useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }

      try {
        const storedAccount = localStorage.getItem('ghostmail_account')
        const storedToken = localStorage.getItem('ghostmail_token')
        
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
  }, [])

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
       // audio.play().catch(() => {}); 
    }
    setPreviousMessageCount(messages.length);
  }, [messages.length])

  // --- Polling ---
  React.useEffect(() => {
    if (!token) return
    
    const fetchMessages = async () => {
      try {
        const data = await mailApi.getMessages(token)
        const apiMessages = data['hydra:member'] || []
        
        // Merge with existing to preserve body content if already fetched
        setMessages(prev => {
          const newMessages = apiMessages.map((m: MessageSummary) => {
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
              tag: 'inbox'
            }
          })
          return newMessages
        })
      } catch (e) {
        console.error("Fetch failed:", e)
      }
    }
    
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [token])

  // --- Actions ---
  const handleDeleteMessage = async (id: string) => {
    if (!token) return;
    try {
      await mailApi.deleteMessage(token, id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessageId === id) setSelectedMessageId(null);
    } catch (e) {
      console.error("Delete failed:", e);
    }
  }

  const createNewAccount = async () => {
    setIsLoading(true)
    try {
      const domains = await mailApi.getDomains()
      if (!domains['hydra:member'] || domains['hydra:member'].length === 0) {
        throw new Error("No domains available")
      }
      const domain = domains['hydra:member'][0].domain
      const username = `ghost.${Math.random().toString(36).substring(7)}`
      const password = `Pwd${Math.random().toString(36).substring(2)}!` // Simpler, robust password
      const address = `${username}@${domain}`
      
      console.log(`Attempting to create account: ${address}`);
      const acc = await mailApi.createAccount(address, password)
      console.log("Account created:", acc);
      
      // Retry logic for token (API eventual consistency)
      let tokData;
      let retries = 10;
      while (retries > 0) {
        try {
           // IMPORTANT: Use acc.address because API might normalize the username (e.g. remove dots)
           console.log(`Attempting login for ${acc.address} (Remaining retries: ${retries})`);
           tokData = await mailApi.getToken(acc.address, password)
           console.log("Token acquired successfully");
           break;
        } catch (err) {
           retries--;
           console.warn(`Login failed for ${acc.address}:`, err);
           if (retries === 0) throw err;
           // Wait before retrying
           await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      setToken(tokData.token)
      setEmail(acc.address)
      setMessages([])
      setSelectedMessageId(null)
      
      localStorage.setItem('ghostmail_account', JSON.stringify(acc))
      localStorage.setItem('ghostmail_token', tokData.token)
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
      const password = `Pwd${Math.random().toString(36).substring(2)}!`
      const address = `${username}@${domain}`
      
      const acc = await mailApi.createAccount(address, password)
      const tokData = await mailApi.getToken(address, password)
      
      setToken(tokData.token)
      setEmail(acc.address)
      setMessages([])
      setSelectedMessageId(null)
      
      localStorage.setItem('ghostmail_account', JSON.stringify(acc))
      localStorage.setItem('ghostmail_token', tokData.token)
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
      const data = await mailApi.getMessages(token)
      // Logic duplicated from effect, but that's fine for explicit refresh
      const apiMessages = data['hydra:member'] || []
      setMessages(prev => apiMessages.map((m: MessageSummary) => {
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
          tag: 'inbox'
        }
      }))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBurn = () => {
    localStorage.removeItem('ghostmail_account')
    localStorage.removeItem('ghostmail_token')
    createNewAccount()
  }

  const handleSelectMessage = async (id: string | null) => {
    setSelectedMessageId(id)
    if (id && token) {
      const msg = messages.find(m => m.id === id)
      if (msg && msg.body === "Loading content...") {
        try {
          const details = await mailApi.getMessage(token, id)
          setMessages(prev => prev.map(m => 
            m.id === id ? { ...m, body: details.text || "No text content" } : m
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
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10 p-4 gap-4">
        
        {!isScreenshotMode && <MailSidebar />}

        <ResizablePanelGroup direction="horizontal" className="flex-1 gap-4">
          
          {/* Message List Panel */}
          {!isScreenshotMode && (
            <>
              <ResizablePanel defaultSize={35} minSize={25} maxSize={45} className="glass-panel rounded-2xl flex flex-col overflow-hidden">
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
            />
          </ResizablePanel>
          
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
