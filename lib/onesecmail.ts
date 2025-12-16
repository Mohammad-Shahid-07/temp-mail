import { MailProvider } from "./mail-provider";

const API_URL = "/api/1secmail";

export const oneSecMailProvider: MailProvider = {
  name: "1secmail",

  createAccount: async (username?: string, domain?: string) => {
    if (username && domain) {
      return { address: `${username}@${domain}` };
    }
    // Generate random
    try {
      const res = await fetch(`${API_URL}?action=genRandomMailbox&count=1`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return { address: data[0] };
      }
      throw new Error("Invalid response from 1secmail");
    } catch (e) {
      console.error("1secmail createAccount error:", e);
      throw e;
    }
  },

  getMessages: async (address: string) => {
    if (!address || !address.includes('@')) {
      return [];
    }
    const [login, domain] = address.split("@");
    const res = await fetch(`${API_URL}?action=getMessages&login=${login}&domain=${domain}`);
    const data = await res.json();
    
    // Map to common format
    return data.map((msg: any) => ({
      id: msg.id,
      from: { address: msg.from, name: msg.from.split('<')[0].trim() || msg.from },
      subject: msg.subject,
      intro: msg.subject, // 1secmail doesn't give preview in list
      seen: false,
      createdAt: msg.date,
      hasAttachments: false // 1secmail list doesn't say
    }));
  },

  getMessage: async (address: string, messageId: string) => {
    const [login, domain] = address.split("@");
    const res = await fetch(`${API_URL}?action=readMessage&login=${login}&domain=${domain}&id=${messageId}`);
    const data = await res.json();

    return {
      id: data.id,
      from: { address: data.from, name: data.from },
      subject: data.subject,
      text: data.textBody,
      html: [data.htmlBody],
      createdAt: data.date,
      attachments: data.attachments.map((att: any) => ({
        id: att.filename,
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
        downloadUrl: `?action=download&login=${login}&domain=${domain}&id=${messageId}&file=${att.filename}` // This needs handling
      }))
    };
  },

  getDomains: async () => {
    const res = await fetch(`${API_URL}?action=getDomainList`);
    const data = await res.json();
    return data;
  }
};
