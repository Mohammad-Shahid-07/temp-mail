const API_BASE = 'https://api.mail.tm';

export interface Account {
  id: string;
  address: string;
  token?: string;
  password?: string;
}

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

export interface MessageDetail extends MessageSummary {
  text: string;
  html: string[];
  retention: boolean;
  retentionDate: string;
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
    const res = await fetch(`${API_BASE}/sources/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch message source');
    return res.json();
  },

  async markAsRead(token: string, id: string) {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'PATCH',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json'
      },
      body: JSON.stringify({ seen: true })
    });
    if (!res.ok) throw new Error('Failed to mark message as read');
    return res.json();
  }
};
