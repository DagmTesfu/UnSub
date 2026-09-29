# Privacy Policy for UnSub

**Last Updated:** September 2026

## Overview

UnSub is an open-source, local-first browser extension designed to help you track your subscription services, detect dormancy based on browser visits, and access direct cancellation pages.

UnSub is built with privacy as a foundational principle:
- **No account required**: You do not need to register, sign in, or provide any personal credentials.
- **No remote servers**: UnSub operates entirely within your browser. There is no remote backend, database, or analytics infrastructure.
- **No data collection or telemetry**: We do not collect, track, log, or sell your personal information or browsing history.

---

## Information Stored Locally

All data handled by UnSub is stored strictly on your local device using the browser's `chrome.storage.local` API. This data includes only what you manually enter:

- **Subscription Name**: A label you assign to the service (e.g., "Netflix").
- **Subscription Domain**: The domain associated with the service (e.g., "netflix.com").
- **Monthly Cost**: The price you manually enter for the subscription.
- **Billing Day (Optional)**: The day of the month the subscription renews.
- **Timestamps**:
  - A record of when the subscription entry was created.
  - A `lastVisitedTimestamp`, which updates locally when you visit a domain matching your subscription list.

None of this information is ever uploaded to a server, synchronized to an external cloud database, or shared with third parties.

---

## Browser Tab Information

UnSub requests the `tabs` permission to monitor tab activity.

- **How it works**: When a tab in your browser completes loading, UnSub inspects the URL's hostname locally in memory.
- **Local matching**: The hostname is compared against the domains in your manually entered subscription list. If a match occurs, UnSub updates the `lastVisitedTimestamp` for that specific subscription entry.
- **No history logging or storage**: UnSub does not store, log, track, or transmit URLs from your browsing history. Unrelated websites you visit are evaluated transiently in memory and immediately discarded.

---

## How Data Is Used

The data stored locally by UnSub is used solely for the following extension features:

1. Displaying your active subscription list and calculating your estimated monthly total.
2. Calculating the number of days since you last visited a subscription domain.
3. Identifying dormant subscriptions (e.g., services not visited in over 30 days or approaching renewal while unused).
4. Generating local desktop notifications via the browser's alarm and notification APIs to warn you about inactive subscriptions.

---

## Data Sharing

UnSub **does not share, sell, rent, or monetize** any user data. All information remains on your local machine within the browser's secure extension sandbox.

---

## Third-Party Services

UnSub does not integrate third-party analytics (such as Google Analytics or PostHog), telemetry frameworks, or advertising networks.

### Cancellation Links and Fallback Searches
- When you click "CANCEL SUBSCRIPTION", UnSub opens the official account management or cancellation webpage for that service in a new browser tab.
- If a direct cancellation link for a specific domain is not in UnSub's local dictionary, UnSub generates a standard Google Search link (`https://www.google.com/search?q=How+to+cancel+[Service+Name]`) so you can locate the relevant page.
- Opening these links is equivalent to navigating to those websites yourself in your browser; their respective privacy policies apply once their pages load.

> **Important**: UnSub does not cancel subscriptions automatically. It provides links or shortcuts that take the user to the relevant service's cancellation or account-management page.

---

## Data Retention and Deletion

- Your data remains stored in your browser's local extension storage until you choose to delete individual entries or remove the extension.
- You can delete any subscription at any time by clicking the **DEL** button next to it in the extension popup.
- Uninstalling the UnSub extension immediately deletes all locally stored data created by the extension.

---

## Permissions

UnSub requests only the minimum permissions necessary to function:

- **`storage`**: Used to save and retrieve your subscription list locally on your device.
- **`tabs`**: Used to check the domain of completed web pages locally in memory to detect visits to your subscription services.
- **`alarms`**: Used to schedule periodic local checks (e.g., every 24 hours) to evaluate subscription dormancy.
- **`notifications`**: Used to display browser desktop notifications when an unused subscription is detected.

---

## Children's Privacy

UnSub does not collect personal information from any user, including children under the age of 13.

---

## Changes to This Policy

If this Privacy Policy is updated, the revised version will be posted in this repository with an updated date. Because UnSub does not collect user contact information, we encourage users to review this policy periodically in the source repository.

---

## Contact

If you have any questions or feedback regarding this Privacy Policy, please open an issue in the official GitHub repository or reach out via email:

`[YOUR CONTACT EMAIL]`
