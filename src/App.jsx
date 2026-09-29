import React, { useState, useEffect } from 'react';
import { getSubscriptions, saveSubscriptions } from './storageApi';
import { CANCEL_URLS } from './cancelLinks';
import './App.css';

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
      lastVisitedTimestamp: Date.now(),
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
        <div className="header-top">
          <h1>UNSUB</h1>
          <span className="badge">v1.0</span>
        </div>
        <p className="subtitle">AUDIT SUBSCRIPTIONS // ELIMINATE WASTE</p>
        <div className="total-badge">
          <span>MONTHLY BLEED:</span>
          <strong>${totalMonthly.toFixed(2)}</strong>
        </div>
      </header>

      <form onSubmit={handleAddSubscription} className="form">
        <div className="form-group">
          <input
            type="text"
            placeholder="SERVICE (e.g. Netflix)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="DOMAIN (e.g. netflix.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="number"
            step="0.01"
            placeholder="COST / MO ($)"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(e.target.value)}
            required
          />
          <button type="submit" className="btn-add">+ TRACK</button>
        </div>
      </form>

      <section className="list-section">
        <h2>ACTIVE TRACKING ({subscriptions.length})</h2>
        {subscriptions.length === 0 ? (
          <div className="onboarding-card">
            <h3 className="onboarding-header">NO ACTIVE TRACKERS</h3>
            <p className="onboarding-desc">
              Add the services you pay for below. We will silently monitor your visits locally in your browser. If you pay for something but don't visit it for 30 days, we will alert you and help you cancel it.
            </p>
            <ol className="onboarding-steps">
              <li className="step-item">
                <span className="step-badge">1</span>
                <span className="step-text">Add a subscription</span>
              </li>
              <li className="step-item">
                <span className="step-badge">2</span>
                <span className="step-text">Browse normally</span>
              </li>
              <li className="step-item">
                <span className="step-badge">3</span>
                <span className="step-text">Stop wasting money</span>
              </li>
            </ol>
          </div>
        ) : (
          <ul className="sub-list">
            {subscriptions.map((sub) => {
              const daysSinceVisit = sub.lastVisitedTimestamp
                ? Math.floor((Date.now() - sub.lastVisitedTimestamp) / (1000 * 60 * 60 * 24))
                : 0;

              const isDanger = daysSinceVisit > 30;

              const cleanDomain = sub.domain.toLowerCase().replace(/^www\./, '');
              const cancelUrl =
                CANCEL_URLS[cleanDomain] ||
                CANCEL_URLS[sub.domain] ||
                `https://www.google.com/search?q=${encodeURIComponent(`How to cancel ${sub.name}`)}`;

              return (
                <li
                  key={sub.id}
                  className={`sub-item ${isDanger ? 'danger' : ''}`}
                >
                  <div className="sub-main-row">
                    <div className="sub-info">
                      <span className="sub-name">{sub.name}</span>
                      <span className="sub-domain">{sub.domain}</span>
                      <span className="sub-status">
                        {daysSinceVisit === 0
                          ? 'VISITED TODAY'
                          : `${daysSinceVisit} DAYS SINCE VISIT`}
                        {isDanger && ' [WASTING MONEY]'}
                      </span>
                    </div>
                    <div className="sub-meta">
                      <span className="sub-cost">${sub.monthlyCost.toFixed(2)}/mo</span>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(sub.id)}
                        title="Remove"
                      >
                        DEL
                      </button>
                    </div>
                  </div>

                  {isDanger && (
                    <div className="cancel-row">
                      <a
                        href={cancelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cancel"
                      >
                        CANCEL SUBSCRIPTION &rarr;
                      </a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
