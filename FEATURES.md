# Feature Specification: The World's Best Temp Mail

## Core Philosophy
*   **Speed:** Instant load, instant reception.
*   **Privacy:** No tracking, local-only data where possible.
*   **Reliability:** Multi-provider redundancy.

## 1. Simple Mode (Public API Aggregator)
*Target Audience: Casual users, quick signups.*

### 📧 Email Management
*   **Multi-Provider Engine:** Seamlessly switch between `Mail.tm`, `1secmail`, and `Guerrilla Mail` if one is blocked.
*   **Custom Usernames:** Choose your own address (e.g., `batman@...`) instead of random strings, where supported.
*   **Reply Capability:** Reply to emails directly from the temp address (supported by Mail.tm).
*   **Multiple Inboxes:** Manage multiple temp addresses simultaneously in tabs/sidebar.
*   **Instant "Copy":** One-click copy to clipboard.
*   **QR Code:** Instantly transfer email address to mobile device.

### ⚡ Real-Time Experience
*   **Browser Notifications:** Get notified even when the tab is in the background.
*   **Audio Alerts:** Subtle sound on new mail.

### 🧠 Smart Features (Global Dominance)
*   **Smart Link Extractor:** Automatically detects "Verify Email" or "Reset Password" links and presents them as big, instant buttons at the top.
*   **Tracker Blocker:** Blocks spy pixels and external images by default to protect your real IP address.
*   **Session Resurrection:** Accidentally closed the tab? Re-open it and your inbox is restored instantly (LocalStorage persistence).
*   **Screenshot Mode:** A distraction-free "Clean View" optimized for taking screenshots of OTPs or proofs.
*   **Plain Text Enforcer:** Toggle to strip all HTML/CSS for a raw, safe, and fast reading experience.

### 🛠️ Power Tools
*   **Fake Identity Generator:** Auto-generate a matching Name, Address, and Password to go with your temp email.
*   **Inbox Backup:** Download all current emails as a `.zip` archive.
*   **Domain Quality Indicator:** Show which domains are "Hot" (working on Netflix/FB) vs "Blocked".
*   **Download EML:** Download raw email files.
*   **Attachment Viewer:** Preview PDF/Images directly in browser.
*   **Source Viewer:** Inspect raw headers and HTML source (for devs).
*   **Auto-Fill Extension:** (Future) Chrome extension to right-click and "Paste Temp Mail".

---

## 2. Custom Domain Mode (SaaS & Self-Hosted)
*Target Audience: Developers, Privacy Enthusiasts, QA Testers.*

### 🌐 Domain Superpowers
*   **Wildcard Catch-All:** No need to create aliases. Send to `anything@your-domain.com` and it just appears.
*   **"Burn" Switch:** Instantly block a specific alias (e.g., `spammy-service@your-domain.com`) while keeping others active.
*   **BYOD (Bring Your Own Domain):** Zero-config setup via Cloudflare.

### 🤖 Developer Features (The "Killer" Features)
*   **Webhooks:** Forward incoming emails to a URL (JSON payload). Perfect for testing auth flows.
*   **Discord/Slack Integration:** Send OTP codes directly to a private channel.
*   **API Access:** Generate a personal API key to fetch your custom domain emails programmatically.
*   **RSS Feed:** Expose an inbox as a private RSS feed.

### 🔒 Privacy & Security
*   **Zero-Knowledge Storage (Self-Hosted):** You own the Worker, you own the Redis. We see nothing.
*   **Auto-Expiration:** Configurable TTL (1 hour, 1 day, 1 week).

---

## 3. Global UX/UI (The "Polish")
*   **PWA Support:** Installable on iOS/Android as a native-like app.
*   **Offline Support:** View previously fetched emails while offline.
*   **Keyboard Shortcuts:** Gmail-style shortcuts (`j`/`k` to navigate, `#` to delete).
*   **Dark/Light Mode:** System sync.
*   **Command Palette:** `Ctrl+K` to switch domains, create new address, or clear inbox.
