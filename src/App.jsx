import React, { useState, useEffect } from 'react';
import { getSubscriptions, saveSubscriptions } from './storageApi';

export default function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  async function loadSubscriptions() {
    const list = await getSubscriptions();
    setSubscriptions(list);
  }

  async function handleAddSubscription(e) {
    e.preventDefault();
    if (!name.trim() || !domain.trim() || !monthlyCost) return;

    const newSub = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: name.trim(),
      domain: domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
      monthlyCost: parseFloat(monthlyCost) || 0,
      lastVisitedTimestamp: null,
    };

    const updated = [...subscriptions, newSub];
    await saveSubscriptions(updated);
    setSubscriptions(updated);
    setName('');
    setDomain('');
    setMonthlyCost('');
  }

  async function handleDelete(id) {
    const updated = subscriptions.filter(sub => sub.id !== id);
    await saveSubscriptions(updated);
    setSubscriptions(updated);
  }

  const totalMonthly = subscriptions.reduce((sum, s) => sum + (s.monthlyCost || 0), 0);

  return (
    <div className="popup-container">
      <header className="header">
        <h1>UnSub</h1>
        <p className="subtitle">Track subscription usage & stop wasting money</p>
        <div className="total-badge">
          <span>Total Monthly:</span> <strong>${totalMonthly.toFixed(2)}</strong>
        </div>
      </header>

      <form onSubmit={handleAddSubscription} className="form">
        <input
          type="text"
          placeholder="Service name (e.g. Netflix)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Domain (e.g. netflix.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Monthly Cost ($)"
          value={monthlyCost}
          onChange={(e) => setMonthlyCost(e.target.value)}
          required
        />
        <button type="submit" className="btn-add">+ Add Subscription</button>
      </form>

      <section className="list-section">
        <h2>Monitored Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p className="empty">No subscriptions added yet.</p>
        ) : (
          <ul className="sub-list">
            {subscriptions.map((sub) => {
              const daysSinceVisit = sub.lastVisitedTimestamp
                ? Math.floor((Date.now() - sub.lastVisitedTimestamp) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <li key={sub.id} className="sub-item">
                  <div className="sub-info">
                    <span className="sub-name">{sub.name}</span>
                    <span className="sub-domain">{sub.domain}</span>
                    <span className="sub-status">
                      {daysSinceVisit === null
                        ? 'Never visited'
                        : daysSinceVisit === 0
                        ? 'Visited today'
                        : `Last visited ${daysSinceVisit}d ago`}
                    </span>
                  </div>
                  <div className="sub-meta">
                    <span className="sub-cost">${sub.monthlyCost.toFixed(2)}/mo</span>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(sub.id)}
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
