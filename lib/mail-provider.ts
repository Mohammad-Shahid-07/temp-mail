export interface MailProvider {
  name: string;
  createAccount: (username?: string, domain?: string) => Promise<{ address: string; token?: string }>;
  getMessages: (tokenOrAddress: string) => Promise<any[]>;
  getMessage: (tokenOrAddress: string, messageId: string) => Promise<any>;
  deleteMessage?: (tokenOrAddress: string, messageId: string) => Promise<void>;
  getDomains: () => Promise<string[]>;
  getMessageSource?: (tokenOrAddress: string, messageId: string) => Promise<any>;
}
