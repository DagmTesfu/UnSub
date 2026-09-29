import { getSubscriptions, saveSubscriptions, getDaysUntilBilling } from './src/storageApi.js';

console.log('UnSub service worker active.');

// 1. Setup audit alarm on installation
chrome.runtime.onInstalled.addListener(() => {
  // Production: Runs once every 24 hours (1440 minutes)
  chrome.alarms.create('dailyAudit', {
    periodInMinutes: 1440,
  });

  // --- Testing Version: Runs every 1 minute (Uncomment to test) ---
  // chrome.alarms.create('dailyAudit', {
  //   periodInMinutes: 1,
  // });

  console.log('UnSub: dailyAudit alarm created.');
});

// 2. Alarm listener to audit subscriptions (Early Warning Engine)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyAudit') {
    try {
      const subscriptions = await getSubscriptions();

      for (const sub of subscriptions) {
        const daysSinceVisit = sub.lastVisitedTimestamp
          ? Math.floor((Date.now() - sub.lastVisitedTimestamp) / (1000 * 60 * 60 * 24))
          : 0;

        const daysUntilBilling = sub.billingDay ? getDaysUntilBilling(sub.billingDay) : null;

        // Proactive Early Warning: Unused in > 14 days and renews within 5 days
        if (daysUntilBilling !== null && daysSinceVisit > 14 && daysUntilBilling <= 5) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: chrome.runtime.getURL('icon-48.png'),
            title: 'UnSub Early Renewal Warning',
            message: `Warning: You haven't used ${sub.name} in ${daysSinceVisit} days. It renews in ${daysUntilBilling} days! You will be charged $${sub.monthlyCost}.`,
            priority: 2,
          });
        } else if (daysSinceVisit > 30) {
          // Standard Dormancy Alert: Unused for over 30 days
          chrome.notifications.create({
            type: 'basic',
            iconUrl: chrome.runtime.getURL('icon-48.png'),
            title: 'UnSub Subscription Alert',
            message: `You haven't used ${sub.name} in 30 days. You are losing $${sub.monthlyCost}/month!`,
            priority: 2,
          });
        }
      }
    } catch (err) {
      console.error('UnSub audit error:', err);
    }
  }
});

// 3. Monitor tab navigation to track subscription domain visits
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab?.url) {
    try {
      const url = new URL(tab.url);
      const hostname = url.hostname.replace(/^www\./, '');
      const subscriptions = await getSubscriptions();

      let updated = false;
      const updatedSubscriptions = subscriptions.map((sub) => {
        const cleanDomain = sub.domain.toLowerCase().replace(/^www\./, '');
        if (hostname === cleanDomain || hostname.endsWith(`.${cleanDomain}`)) {
          updated = true;
          return {
            ...sub,
            lastVisitedTimestamp: Date.now(),
          };
        }
        return sub;
      });

      if (updated) {
        await saveSubscriptions(updatedSubscriptions);
        console.log(`UnSub: Updated visit timestamp for domain matching ${hostname}`);
      }
    } catch (err) {
      console.error('UnSub background error:', err);
    }
  }
});
