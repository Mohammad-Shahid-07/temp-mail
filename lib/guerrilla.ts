import { MailProvider } from "./mail-provider";

const API_URL = "/api/guerrilla";

export const guerrillaProvider: MailProvider = {
  name: "Guerrilla",

  createAccount: async (username?: string, domain?: string) => {
    // Guerrilla assigns an address on initialization (get_email_address)
    // We can't easily force a username without setting it after init, but for simplicity we'll just get a random one.
    // If username is provided, we might try 'set_email_user' action later, but let's start simple.
    
    const res = await fetch(`${API_URL}?f=get_email_address&lang=en`);
    const data = await res.json();
    
    // Guerrilla returns { email_addr, sid_token, ... }
    // We need to store sid_token to maintain session. 
    // The proxy might handle cookies, but passing sid_token explicitly is safer.
    
    return { 
      address: data.email_addr,
      token: data.sid_token 
    };
  },

  getMessages: async (token: string) => {
    // token here is the sid_token
    // seq=0 gets all messages
    const res = await fetch(`${API_URL}?f=check_email&seq=0&sid_token=${token}`);
    const data = await res.json();
    
    // data.list is the array of messages
    if (!data.list) return [];

    return data.list.map((msg: any) => ({
      id: msg.mail_id,
      from: { address: msg.mail_from, name: msg.mail_from.split('<')[0].trim() },
      subject: msg.mail_subject,
      intro: msg.mail_excerpt,
      seen: msg.mail_read === "1",
      createdAt: new Date(parseInt(msg.mail_timestamp) * 1000).toISOString(),
      hasAttachments: msg.att > 0
    }));
  },

  getMessage: async (token: string, messageId: string) => {
    const res = await fetch(`${API_URL}?f=fetch_email&email_id=${messageId}&sid_token=${token}`);
    const data = await res.json();

    return {
      id: data.mail_id,
      from: { address: data.mail_from, name: data.mail_from },
      subject: data.mail_subject,
      text: data.mail_body, // Guerrilla returns HTML usually, or text. 
      html: [data.mail_body], // It's usually HTML
      createdAt: new Date(parseInt(data.mail_timestamp) * 1000).toISOString(),
      attachments: [] // Guerrilla attachments are complex to fetch via this API wrapper without more work
    };
  },

  getDomains: async () => {
    // Guerrilla has a fixed set of domains, usually returned in get_email_address
    // We can't easily fetch just domains without creating a session.
    return ["guerrillamail.com", "guerrillamailblock.com", "sharklasers.com", "guerrillamail.net", "guerrillamail.org"];
  },
  
  deleteMessage: async (token: string, messageId: string) => {
     await fetch(`${API_URL}?f=del_email&email_ids[]=${messageId}&sid_token=${token}`);
  }
};
