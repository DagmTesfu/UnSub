import { getSubscriptions, saveSubscriptions } from './src/storageApi.js';

console.log('UnSub service worker active.');

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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

// 2. Alarm listener to audit subscriptions
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyAudit') {
    try {
      const subscriptions = await getSubscriptions();

      for (const sub of subscriptions) {
        if (sub.lastVisitedTimestamp && Date.now() - sub.lastVisitedTimestamp > THIRTY_DAYS_MS) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
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
