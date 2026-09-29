/**
 * Storage utility functions for the UnSub Chrome Extension.
 *
 * Subscription object schema:
 * {
 *   id: string | number,
 *   name: string,
 *   domain: string,
 *   monthlyCost: number,
 *   lastVisitedTimestamp: number | null
 * }
 */

const STORAGE_KEY = 'subscriptions';

/**
 * Saves an array of subscription objects to chrome.storage.local.
 * @param {Array<{ id: string|number, name: string, domain: string, monthlyCost: number, lastVisitedTimestamp: number|null }>} subscriptions
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
 * @returns {Promise<Array<{ id: string|number, name: string, domain: string, monthlyCost: number, lastVisitedTimestamp: number|null }>>}
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
