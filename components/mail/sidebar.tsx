"use client"

import * as React from "react"
import { Inbox, Star, History, Archive, Trash2, User, KeyRound } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface MailSidebarProps {
  onOpenFakeID?: () => void
  onOpenPasswordGen?: () => void
}

export function MailSidebar({ onOpenFakeID, onOpenPasswordGen }: MailSidebarProps) {
  return (
    <TooltipProvider>
      <nav className="w-[70px] glass-panel rounded-2xl flex flex-col items-center py-6 gap-4">
        <NavButton icon={Inbox} label="Inbox" active />
        <NavButton icon={Star} label="Starred" />
        <NavButton icon={History} label="History" />
        <NavButton icon={Archive} label="Archive" />
        
        <div className="w-8 h-px bg-white/10 my-2" />

        <NavButton icon={User} label="Fake Identity" onClick={onOpenFakeID} />
        <NavButton icon={KeyRound} label="Password Gen" onClick={onOpenPasswordGen} />
        
        <div className="mt-auto">
          <NavButton icon={Trash2} label="Trash" />
        </div>
      </nav>
    </TooltipProvider>
  )
}

function NavButton({ icon: Icon, label, active, onClick }: { icon: React.ElementType, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          onClick={onClick}
          className={cn(
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
