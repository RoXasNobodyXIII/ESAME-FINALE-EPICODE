import React, { useEffect, useState } from 'react';
import { getUserRole, getAccessToken } from '../auth';

const ReportFogliMarcia = () => {
  useEffect(() => { document.title = 'Report Fogli di Marcia'; }, []);

  const role = getUserRole();
  const [mezzo, setMezzo] = useState('');
  const [postazione, setPostazione] = useState('ALL');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const buildParams = () => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (mezzo && mezzo !== 'ALL') params.append('mezzo', mezzo);
    if (role === 'admin' && postazione && postazione !== 'ALL') params.append('postazione', postazione);
    return params;
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    setError('');
    setPreviewUrl('');
    if (!mezzo) { setError('Seleziona un mezzo'); return; }
    const params = buildParams();
    params.append('disposition', 'inline');
    const url = `/fogli-marcia/report?${params.toString()}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
      if (!res.ok) throw new Error('Errore generazione report');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
    } catch (err) {
      setError(err.message || 'Errore generazione report');
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    setError('');
    if (!mezzo) { setError('Seleziona un mezzo'); return; }
    const params = buildParams();
    const url = `/fogli-marcia/report?${params.toString()}`; // default attachment
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
      if (!res.ok) throw new Error('Errore generazione report');
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'report-fogli-marcia.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || 'Errore generazione report');
    }
  };

  return (
    <div>
      <h4 className="mb-3">Report Fogli di Marcia</h4>

      <form className="row g-3 align-items-end" onSubmit={handlePreview}>
        <div className="col-md-4">
          <label className="form-label">📆 Dal</label>
          <input type="datetime-local" className="form-control" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">📆 Al</label>
          <input type="datetime-local" className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">🚑 Mezzo</label>
          <select className="form-select" value={mezzo} onChange={(e) => setMezzo(e.target.value)}>
            <option value="">- SELEZIONA -</option>
            <option value="ALL">Seleziona Tutti</option>
            <option value="A03 - GG772FV - 1106">A03 - GG772FV - 1106</option>
            <option value="A04 - GN005MH - 1284">A04 - GN005MH - 1284</option>
          </select>
        </div>
        {role === 'admin' && (
          <div className="col-md-4">
            <label className="form-label">🏪 Postazione</label>
            <select className="form-select" value={postazione} onChange={(e) => setPostazione(e.target.value)}>
              <option value="ALL">TUTTI</option>
              <option value="Gaeta">Gaeta</option>
              <option value="Spot Roma">Spot Roma</option>
              <option value="Spot Latina">Spot Latina</option>
              <option value="Spot Frosisnone">Spot Frosisnone</option>
              <option value="Sperlonga Mare">Sperlonga Mare</option>
            </select>
          </div>
        )}
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-secondary">Anteprima</button>
          <button type="button" className="btn btn-primary" onClick={handleDownload}>Scarica PDF</button>
        </div>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {previewUrl && (
        <div className="mt-3">
          <embed src={previewUrl} type="application/pdf" width="100%" height="800px" />
        </div>
      )}
    </div>
  );
};

export default ReportFogliMarcia;
