/**
 * Storage utility functions for the UnSub Chrome Extension.
 *
 * Subscription object schema:
 * {
 *   id: string | number,
 *   name: string,
 *   domain: string,
 *   monthlyCost: number,
 *   billingDay: number | null,
 *   lastVisitedTimestamp: number | null
 * }
 */

const STORAGE_KEY = 'subscriptions';

/**
 * Saves an array of subscription objects to chrome.storage.local.
 * @param {Array<{ id: string|number, name: string, domain: string, monthlyCost: number, billingDay?: number|null, lastVisitedTimestamp: number|null }>} subscriptions
 * @returns {Promise<void>}
 */
export async function saveSubscriptions(subscriptions) {
  if (!Array.isArray(subscriptions)) {
    throw new TypeError('Expected subscriptions to be an array');
  }

  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEY]: subscriptions }, () => {
        if (chrome.runtime?.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve();
      });
    });
  }

  // Fallback for local browser development and testing
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
}

/**
 * Retrieves the array of subscription objects from chrome.storage.local.
 * @returns {Promise<Array<{ id: string|number, name: string, domain: string, monthlyCost: number, billingDay?: number|null, lastVisitedTimestamp: number|null }>>}
 */
export async function getSubscriptions() {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (chrome.runtime?.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve(result[STORAGE_KEY] || []);
      });
    });
  }

  // Fallback for local browser development and testing
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Calculates days remaining until the next billing date.
 * If billing date has already passed or is today, advances to next month.
 * @param {number|string|null} billingDay Day of month (1-31)
 * @returns {number|null} Days until next billing date, or null if invalid
 */
export function getDaysUntilBilling(billingDay) {
  const day = parseInt(billingDay, 10);
  if (!day || isNaN(day) || day < 1 || day > 31) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  const todayMidnight = new Date(currentYear, currentMonth, currentDay);

  // Target date for this month
  const lastDayThisMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const clampedThisMonthDay = Math.min(day, lastDayThisMonth);
  let target = new Date(currentYear, currentMonth, clampedThisMonthDay);

  // If target has already passed earlier this month, advance to next month
  if (target < todayMidnight) {
    const lastDayNextMonth = new Date(currentYear, currentMonth + 2, 0).getDate();
    const clampedNextMonthDay = Math.min(day, lastDayNextMonth);
    target = new Date(currentYear, currentMonth + 1, clampedNextMonthDay);
  }

  const diffMs = target.getTime() - todayMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
