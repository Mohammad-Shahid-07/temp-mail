# Temp Mail Service Project Plan

## Project Goal
Create a comprehensive temporary email service with three distinct modes:
1.  **Simple Mode:** Aggregates multiple public APIs (Mail.tm, 1secmail, etc.) for instant, zero-config temporary emails with redundancy.
2.  **Managed Custom Domain (SaaS):** Users forward their domain's email to us. We handle the infrastructure.
3.  **Self-Hosted Custom Domain (DIY):** Users deploy our open-source Worker to their own Cloudflare account for maximum privacy.

## Technology Stack (Free Tier Optimized)

| Component | Technology | Why? |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15 (App Router)** | React framework, easy deployment to Vercel. |
| **Hosting** | **Vercel** | Best free tier for Next.js, global CDN. |
| **Database** | **Upstash Redis** | Serverless Redis. Free tier allows 10k requests/day. Perfect for "expiring" data like temp emails. |
| **Public API** | **Mail.tm, 1secmail, etc.** | Aggregated to provide more domain options and failover redundancy. |
| **Custom Email** | **Cloudflare Email Routing** | Receives emails for custom domains for free. |
| **Email Logic** | **Cloudflare Workers** | Processes incoming emails from Email Routing and saves them to Redis. |

---

## Architecture

### Version 1: Simple Mode (Public API)
*   **Flow:** User visits site -> Browser calls `mail.tm` API -> Generates random address -> Polls/Listens for emails.
*   **Pros:** Zero setup for the user. Works instantly.
*   **Cons:** Domain is shared (e.g., `@adguard.com`), not custom.
Managed Custom Domain (SaaS)
*   **Concept:** "Bring Your Own Domain" without coding.
*   **Flow:**
    1.  User adds `ingest@our-service.com` as a destination in their Cloudflare Email Routing.
    2.  User creates a rule to send `*@their-domain.com` to us.
    3.  Our Worker verifies the domain and routes emails to the user's inbox on our site.
*   **Pros:** Easy setup, no coding required.
*   **Cons:** Requires trusting us with the email stream.

### Version 3: Self-Hosted Custom Domain (DIY)
*   **Concept:** "Your Cloudflare, Your Rules".
*   **Flow:**
    1.  User forks our Open Source Worker script.
    2.  User deploys it to **their own** Cloudflare account (Free Tier).
    3.  User points their domain to their own Worker.
    4.  User enters their Worker URL into our Frontend (or hosts the Frontend themselves).
*   **Pros:** 100% Privacy, Zero Trust required.
*   **Cons:** Requires developer knowledge (git, wrangler)
    *   **Scalable:** We just process the incoming stream at `ingest@our-service.com`.

---

## Implementation Roadmap

### Phase 1: Project Scaffolding & UI
- [ ] Set up Next.js project with Tailwind CSS.
- [ ] Create a clean, modern UI for the Inbox.
- [ ] Create a "Switch Mode" toggle (Public vs. Custom).

### Phase 2: Simple Mode (Multi-Provider Integration)
- [ ] **Adapter Pattern:** Create a standard `MailProvider` interface (createAccount, getMessages, getMessage).
- [ ] **Implement Providers:**
    - [ ] `Mail.tm` (Primary, supports SSE).
    - [ ] `1secmail` (Secondary, polling based).
    - [ ] `Guerrilla Mail` (Optional/Fallback).
- [ ] **UI:** Add a dropdown to switch between providers/domains.
- [ ] Build the Unified Email View component.

### Phase 3: Custom Domain Backend (The Engine)
- [ ] **The Worker:** Write a Cloudflare Worker script that:
    -   Receives the `message` event.
    -   **Verification Logic:** Detects if the email is a "Cloudflare Routing Verification" email. If so, extract the verification link/code and log it (or auto-verify).
    -   **Standard Logic:** Parses the raw email (using `postal-mime`).
    -   Extracts the *original* recipient (X-Envelope-To).
    -   Connects to Upstash Redis via REST API.
    -   Saves the email to a list: `INBOX:<full_email_address>`.
- [ ] **The Frontend:**
    -   Add an environment variable config for Redis credentials.
    -   Create a Server Action in Next.js to fetch emails from Redis.

### Phase 4: Multi-tenant Domain Management (SaaS Features)
- [ ] **Domain Setup Wizard:**
    -   Instructions for users: "Add `ingest@our-service.com` to your Cloudflare Email Routing".
    -   UI to display the "Verification Code" received by our Worker (so the user can complete the setup).
- [ ] **Routing Logic:**
    -   Update Worker to check if the incoming domain is in the "Verified Domains" list in Redis before accepting the email.

### Phase 5: Documentation & Open Source Prep
- [ ] Write a detailed `README.md` guide on how to:
    -   Deploy the Worker to Cloudflare.
    -   Set up the Email Routing rule.
    -   Create the Upstash Redis database.
    -   Deploy the frontend to Vercel.

## Next Steps
I am ready to start with **Phase 1 & 2**. Shall we begin by building the UI and integrating the `mail.tm` API?
