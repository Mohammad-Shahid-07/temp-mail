import { MailProvider } from "./mail-provider";

const API_URL = "/api/mailsac";

export const mailsacProvider: MailProvider = {
  name: "Mailsac",

  createAccount: async (username?: string, domain?: string) => {
    // Mailsac is public. We can just pick a random address.
    // Domain is always mailsac.com for free public tier.
    const name = username || Math.random().toString(36).substring(7);
    const address = `${name}@mailsac.com`;
    return { address, token: address }; // No token needed for public, just use address
  },

  getMessages: async (address: string) => {
    // Endpoint: addresses/{email}/messages
    const res = await fetch(`${API_URL}?endpoint=addresses/${address}/messages`);
    if (!res.ok) return [];
    const data = await res.json();
    
    return data.map((msg: any) => ({
      id: msg._id,
      from: { address: msg.from[0].address, name: msg.from[0].name || msg.from[0].address },
      subject: msg.subject,
      intro: msg.originalInbox, // Mailsac doesn't give snippet in list easily
      seen: false, // Public inboxes don't track read state per user really
      createdAt: msg.received,
      hasAttachments: (msg.attachments && msg.attachments.length > 0)
    }));
  },

  getMessage: async (address: string, messageId: string) => {
    // Mailsac public API is tricky for body. 
    // https://mailsac.com/api/text/{email}/{messageId} gives text
    // https://mailsac.com/api/body/{email}/{messageId} gives html (sanitized)
    
    const resText = await fetch(`${API_URL}?endpoint=text/${address}/${messageId}`);
    const textBody = await resText.text();
    
    // We need to fetch metadata again or pass it? 
    // The getMessages list had some info, but getMessage needs to return full details.
    // We'll just return what we can.
    
    return {
      id: messageId,
      from: { address: "Unknown", name: "Sender" }, // We lose this if we don't cache list, but UI might handle it.
      subject: "Message", // Same issue
      text: textBody,
      html: [textBody], // Fallback to text as HTML
      createdAt: new Date().toISOString(),
      attachments: []
    };
  },

  getDomains: async () => {
    return ["mailsac.com"];
  }
};
