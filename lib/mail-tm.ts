import { MailProvider } from "./mail-provider";

const API_BASE = 'https://api.mail.tm';

export interface Account {
  id: string;
  address: string;
  token?: string;
  password?: string;
}
/* ... existing interfaces ... */
export interface MessageSummary {
  id: string;
  accountId: string;
  msgid: string;
  from: {
    address: string;
    name: string;
  };
  to: {
    address: string;
    name: string;
  }[];
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  contentType: string;
  disposition: string;
  transferEncoding: string;
  related: boolean;
  size: number;
  downloadUrl: string;
}

export interface MessageDetail extends MessageSummary {
  text: string;
  html: string[];
  retention: boolean;
  retentionDate: string;
  attachments: Attachment[];
}

export const mailApi = {
  async getDomains() {
    const res = await fetch(`${API_BASE}/domains`);
    if (!res.ok) throw new Error('Failed to fetch domains');
    return res.json();
  },

  async createAccount(address: string, password: string) {
    const res = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password }),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to create account: ${res.status} ${error}`);
    }
    return res.json();
  },

  async getToken(address: string, password: string) {
    const res = await fetch(`${API_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password }),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to get token: ${res.status} ${error}`);
    }
    return res.json(); // returns { token: "..." }
  },

  async getMessages(token: string, page = 1) {
    const res = await fetch(`${API_BASE}/messages?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async getMessage(token: string, id: string) {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch message details');
    return res.json();
  },
  
  async deleteMessage(token: string, id: string) {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete message');
    return true;
  },

  async getMessageSource(token: string, id: string) {
    const res = await fetch(`${API_BASE}/messages/${id}/source`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch source');
    return res.json();
  }
};

export const mailTmProvider: MailProvider = {
  name: "Mail.tm",
  createAccount: async (username?: string, domain?: string) => {
    // Mail.tm requires password
    const pwd = `Pwd${Math.random().toString(36).substring(2)}!`;
    let addr = "";
    
    if (username && domain) {
      addr = `${username}@${domain}`;
    } else {
      const domains = await mailApi.getDomains();
      const d = domains['hydra:member'][0].domain;
      addr = `ghost.${Math.random().toString(36).substring(7)}@${d}`;
    }

    const account = await mailApi.createAccount(addr, pwd);
    
    // Retry logic for token (API eventual consistency)
    let tokenData;
    let retries = 10;
    while (retries > 0) {
      try {
         // Use account.address in case the API normalized the input address
         tokenData = await mailApi.getToken(account.address, pwd);
         break;
      } catch (err) {
         retries--;
         if (retries === 0) throw err;
         await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { address: account.address, token: tokenData.token };
  },
  getMessages: async (token: string) => {
    const data = await mailApi.getMessages(token);
    return (data['hydra:member'] || []).map((m: any) => ({
      id: m.id,
      from: m.from,
      subject: m.subject,
      intro: m.intro,
      seen: m.seen,
      createdAt: m.createdAt,
      hasAttachments: m.hasAttachments,
      downloadUrl: m.downloadUrl
    }));
  },
  getMessage: async (token: string, id: string) => {
    return await mailApi.getMessage(token, id);
  },
  deleteMessage: async (token: string, id: string) => {
    await mailApi.deleteMessage(token, id);
  },
  getMessageSource: async (token: string, id: string) => {
    return await mailApi.getMessageSource(token, id);
  },
  getDomains: async () => {
    const data = await mailApi.getDomains();
    return data['hydra:member'].map((d: any) => d.domain);
  }
};

