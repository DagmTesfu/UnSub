# UnSub

> **Stop paying for things you don't use.**

A brutalist, privacy-first browser extension that tracks visits to user-added subscription services and highlights subscriptions that haven't been used recently, with direct cancellation links.

---

## Features

- **Manual Subscription Entry**: Add any subscription service with its name, web domain, monthly cost, and optional billing renewal day.
- **Automated Domain Visit Tracking**: Monitors active browser navigation in the background and logs the last time you visited that service's domain.
- **Inactivity & Early Warning Detection**: Identifies subscriptions not visited in over 30 days, as well as subscriptions unused for 14+ days that renew within 5 days.
- **Direct Cancellation Shortcuts**: Provides one-click access to the service's official cancellation or account management page (with an automated Google Search fallback for unlisted domains).
- **Desktop Notifications**: Periodic local audits trigger desktop alerts before unused subscriptions renew or when they become dormant.
- **Local-Only Storage**: All data stays in your browser via `chrome.storage.local`.
- **Zero Tracking / Zero Telemetry**: No user accounts, no remote backend, no third-party APIs, and no analytics.

> **Important Limitations**:
> - UnSub tracks browser visits to domains the user has added. It does not automatically discover subscriptions from bank accounts, email, payment providers, or mobile/TV applications.
> - UnSub does not automatically cancel subscriptions. It provides direct links or shortcuts that take you to the relevant service's cancellation or account-management page.

---

## Privacy

UnSub operates entirely on your device. Subscription details are stored locally in `chrome.storage.local`, and tab domain checking is performed purely in memory. No browsing history, personal data, or usage metrics are ever sent to an external server.

For full details, please review our [PRIVACY.md](PRIVACY.md).

---

## Installation for Chrome

1. Download the latest release `.zip` from GitHub Releases (or clone this repository).
2. Extract the archive on your local computer.
3. If building from source, run:
   ```bash
   npm install
   npm run build
   ```
4. Open Google Chrome and navigate to `chrome://extensions`.
5. Toggle **Developer mode** on (top-right corner).
6. Click **Load unpacked** (top-left corner).
7. Select the **`dist/`** directory within the project folder.

> **Note**: Do **not** load the root project directory. The root contains uncompiled React JSX source code; Chrome requires the bundled files produced in `dist/`.

---

## Installation for Microsoft Edge

1. Open Microsoft Edge and navigate to `edge://extensions`.
2. Turn on the **Developer mode** toggle in the left sidebar.
3. Click **Load unpacked**.
4. Select the built **`dist/`** directory.

> **Official Store Listing**:  
> `[EDGE ADD-ONS LINK — TO BE ADDED AFTER APPROVAL]`

---

## Development

Prerequisites: Node.js (v18+) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server with Hot Module Replacement
npm run dev

# 3. Compile the production extension bundle into dist/
npm run build
```

- `npm run dev`: Runs the Vite development server for rapid UI styling and component testing.
- `npm run build`: Bundles the React application, background service worker, manifest, and icons into the standalone `dist/` directory ready to be loaded as an unpacked extension.

---

## Architecture

UnSub is built on Manifest V3 using modern web standards:

- **Frontend Popup**: React 18 bundled with Vite and styled with a brutalist dark theme.
- **Manifest V3 Core**: Configured for Chromium-based browsers (Chrome, Edge, Brave, Opera).
- **Background Service Worker (`background.js`)**: Runs in the background to handle:
  - `chrome.tabs.onUpdated`: Inspects active tab URLs locally to update `lastVisitedTimestamp` for matching domains.
  - `chrome.alarms`: Triggers a periodic `'dailyAudit'` wake-up alarm every 24 hours.
  - `chrome.notifications`: Dispatches desktop alerts for dormant or upcoming renewals.
- **Storage Layer (`src/storageApi.js`)**: Abstracted interface for `chrome.storage.local`.
- **Cancellation Dictionary (`src/cancelLinks.js`)**: Static mapping of popular subscription domains to direct account management links.

---

## Project Structure

```text
unsub/
├── public/                 # Static extension assets
│   ├── icon-16.png         # 16x16 extension icon
│   ├── icon-48.png         # 48x48 extension & notification icon
│   ├── icon-128.png        # 128x128 store & management icon
│   └── icon.png            # Icon asset
├── src/
│   ├── App.css             # Brutalist dark theme stylesheet
│   ├── App.jsx             # Main popup React component
│   ├── cancelLinks.js      # Direct cancellation URL dictionary
│   ├── index.css           # Global typography and base styles
│   ├── main.jsx            # React root mount
│   └── storageApi.js       # chrome.storage.local helper functions
├── background.js           # MV3 background service worker
├── index.html              # Extension popup HTML entry point
├── manifest.json           # Manifest V3 extension configuration
├── package.json            # Node.js project manifest & scripts
├── vite.config.js          # Vite + @crxjs plugin build configuration
├── PRIVACY.md              # Project privacy policy
└── STORE_METADATA.md       # Chrome Web Store & Edge Add-ons metadata
```

---

## Permissions

UnSub requests only four permissions in `manifest.json`:

| Permission | Purpose |
| :--- | :--- |
| **`storage`** | Saves your subscription entries locally in `chrome.storage.local` across browser sessions. |
| **`tabs`** | Allows the background service worker to check the URL of completed tab navigations in memory. This is strictly used to match hostnames against your tracked subscriptions and record the visit time. Tab URLs are never logged, stored in history, or sent over the network. |
| **`alarms`** | Schedules the local 24-hour background audit without keeping a script continuously active in memory. |
| **`notifications`** | Displays desktop alerts when an unused subscription reaches the 30-day dormancy threshold or approaches an auto-renewal date. |

---

## Limitations

- **Manual Subscription Entry**: Subscriptions must be added manually by the user.
- **Browser-Domain Visits Only**: UnSub only tracks visits that occur inside the browser where the extension is installed.
- **No Automatic Subscription Discovery**: UnSub does not connect to bank accounts, credit cards, or email accounts.
- **No Automatic Cancellation**: UnSub does not log into third-party accounts or submit cancellation forms on your behalf; it provides direct links to the cancellation pages.
- **No Mobile / TV App Tracking**: Usage of native desktop apps, mobile apps, or Smart TV apps (such as watching Netflix on a TV or playing Spotify in a desktop app) is not detectable by browser extensions.

---

## License

License: To be determined.
