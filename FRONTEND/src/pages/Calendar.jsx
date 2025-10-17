import React, { useEffect, useState } from 'react';

const Calendar = () => {
  useEffect(() => {
    document.title = 'Calendario turni';
  }, []);

  // Google Sheets //
  const SHEET_EMBED_URL =
    'https://docs.google.com/spreadsheets/d/1O34kqNWVjDBG8CeSE8EJYRTu5PorV9pC/pubhtml?widget=true&headers=false';
  const SHEET_EDIT_URL =
    'https://docs.google.com/spreadsheets/d/1O34kqNWVjDBG8CeSE8EJYRTu5PorV9pC/edit?usp=sharing';


  const [cacheKey, setCacheKey] = useState(() => Date.now());
  const refreshEmbed = () => setCacheKey(Date.now());

  return (
    <div>
      <h4>Calendario turni</h4>
      <p className="text-muted mb-2">
        Il calendario turni è gestito tramite Google Sheets.
      </p>

      <div className="d-flex align-items-center justify-content-between mb-2">
        <small className="text-muted">Ultimo aggiornamento incorporato: {new Date(cacheKey).toLocaleTimeString()}</small>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={refreshEmbed}>Aggiorna</button>
          <a
            className="btn btn-sm btn-outline-primary"
            href={SHEET_EDIT_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            Apri Google Fogli
          </a>
        </div>
      </div>

      <div className="ratio ratio-16x9" style={{ minHeight: 500 }}>
        <iframe
          src={`${SHEET_EMBED_URL}${SHEET_EMBED_URL.includes('?') ? '&' : '?'}cb=${cacheKey}`}
          title="Calendario turni - Google Sheets"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0, width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default Calendar;
