# Store Listing Metadata (Microsoft Edge Add-ons & Chrome Web Store)

This document contains pre-formulated metadata, permission justifications, and store descriptions prepared for submission to the **Microsoft Edge Add-ons Partner Center** and the **Chrome Web Store Developer Dashboard**.

---

## 1. General Listing Info

- **Extension Name**: UnSub
- **Version**: 1.0.0
- **Supported Languages**: English
- **Recommended Category**: *Productivity* (or *Utilities / Personal Finance*) — *Note: This is a recommendation; actual category options vary slightly between Microsoft Partner Center and Chrome Web Store.*

---

## 2. Short Description

> Track subscription usage locally and find direct cancellation links for services you no longer use.

*(100 characters max on Chrome Web Store: exactly 95 characters)*

---

## 3. Full Description

```text
Stop paying for services you forgot you had.

UnSub is a local-first, privacy-focused browser extension designed to help you identify unused subscriptions and eliminate wasted monthly spending.

HOW IT WORKS:
1. Add Your Subscriptions: Enter the name, web domain, and monthly cost for the services you pay for (e.g., streaming platforms, SaaS tools, news subscriptions, memberships).
2. Browse Normally: When you visit a website matching one of your tracked services, UnSub automatically updates your local visit history.
3. Catch Dormant Subscriptions: If you haven't visited a subscription domain in over 30 days—or if an unused subscription is renewing soon—UnSub flags it and alerts you.
4. One-Click Cancellation Shortcuts: When a subscription is flagged, click the cancellation button to jump straight to that service's official account management or cancellation page. If a direct link isn't in our offline directory, UnSub automatically generates a focused search query to help you find the right page quickly.

PRIVACY-FIRST ARCHITECTURE:
- 100% Local Storage: All data is saved inside your browser via chrome.storage.local.
- No External Servers: No data is ever transmitted across the network.
- In-Memory URL Matching: UnSub only checks tab domain names in memory to record visit timestamps. Your browsing history is never stored, logged, or shared.
- No Accounts or Telemetry: No registration, no tracking scripts, and no analytics.

IMPORTANT LIMITATIONS:
- UnSub tracks web visits within this browser only. It cannot detect activity on native desktop apps, mobile devices, or Smart TVs.
- UnSub does not connect to bank accounts or credit cards; subscriptions must be entered manually.
- UnSub does not automatically cancel subscriptions on your behalf. It provides direct shortcuts to the official cancellation portals where you can complete the cancellation.
```

---

## 4. Single-Purpose & Permission Justifications

Both the Chrome Web Store and Microsoft Edge Partner Center require explicit justifications for all requested permissions. Use the exact text below during submission:

### Single-Purpose Description
> UnSub's single purpose is to help users track how frequently they visit user-defined subscription domains in their browser and provide direct shortcuts to cancellation pages for inactive services.

---

### Permission: `storage`
**Justification**:
> UnSub uses the `storage` permission to save the user's manually entered subscription list (service name, domain, monthly cost, and visit timestamps) locally on the device using `chrome.storage.local`. No data is synced or sent to an external server.

---

### Permission: `tabs`
**Justification**:
> UnSub uses the tabs permission to inspect the URL of completed browser tabs locally and compare the hostname against subscription domains manually added by the user. This allows UnSub to update the last-visited timestamp for those subscriptions. Tab URLs are processed locally and are not transmitted to a server.

---

### Permission: `notifications`
**Justification**:
> UnSub uses the `notifications` permission to display local desktop notifications alerting users when a manually added subscription has not been visited for more than 30 days or is approaching renewal while unused.

---

### Permission: `alarms`
**Justification**:
> UnSub uses the `alarms` permission to run a periodic daily check in the background service worker that evaluates locally stored subscription timestamps and triggers dormancy notifications when appropriate, without requiring a persistent background process.

---

## 5. Store URLs & Contact Placeholders

- **Privacy Policy URL**: `Privacy Policy URL: [TO BE HOSTED]` *(e.g., link to hosted PRIVACY.md on GitHub Pages or personal portfolio)*
- **Support URL**: `Support URL: [GITHUB REPOSITORY URL]` *(e.g., https://github.com/DagmTesfu/UnSub/issues)*
- **Developer Contact Email**: `[YOUR CONTACT EMAIL]`

---

## 6. Recommended Search Keywords / Tags

- subscriptions
- subscription tracker
- cancel subscriptions
- unused subscriptions
- privacy
- money saving
