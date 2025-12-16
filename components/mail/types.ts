export type Message = {
  id: string
  sender: string
  email: string
  subject: string
  time: string
  preview: string
  body: string
  html?: string[]
  read: boolean
  tag?: 'inbox' | 'spam' | 'updates'
  hasAttachments?: boolean
  attachments?: any[]
  downloadUrl?: string
  otp?: string
  actionLink?: { url: string; label: string }
}

export const INITIAL_MESSAGES: Message[] = [
  { 
    id: "1", 
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
