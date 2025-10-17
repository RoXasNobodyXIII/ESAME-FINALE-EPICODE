
import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';

const FogliMarcia = () => {
  useEffect(() => {
    document.title = 'Fogli di Marcia';
  }, []);

  const [mezzo, setMezzo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null); // item in modifica
  const [saving, setSaving] = useState(false);

  // Carica elenco mezzo
  useEffect(() => {
    setError('');
    setItems([]);
    const m = (mezzo || '').trim();
    if (!m) return;
    setLoading(true);
    const params = { mezzo: m };
    api
      .get('/fogli-marcia', { params })
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.response?.data?.message || 'Errore nel caricamento'))
      .finally(() => setLoading(false));
  }, [mezzo]);

  // Raggruppa per data
  const grouped = useMemo(() => {
    const fmtDate = (d) => {
      if (!d) return '';
      const dt = typeof d === 'string' && d.length <= 10 ? new Date(d) : new Date(d);
      if (Number.isNaN(dt.getTime())) return '';
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const map = new Map();
    for (const it of items) {
      const key = fmtDate(it.data || it.createdAt) || 'Senza data';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    }
    // ordina gruppi
    const seqOf = (it) => {
      const sc = it.serviceCode;
      if (sc) {
        const m = sc.match(/^CDO\d{2}(\d{4,5})$/);
        if (m) return Number(m[1]);
      }
      return Number(it.id) || 0;
    };
    const entries = Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0))
      .map(([d, arr]) => [d, arr.slice().sort((a, b) => seqOf(a) - seqOf(b))]);
    return entries;
  }, [items]);

  const openEdit = (it) => setEditItem({ ...it });
  const closeEdit = () => setEditItem(null);
  const onEditField = (k, v) => setEditItem((e) => ({ ...e, [k]: v }));
  const saveEdit = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      const payload = {
        indirizzo: editItem.indirizzo,
        uscita: editItem.uscita,
        sulPosto: editItem.sulPosto,
        arrivoDestinazione: editItem.arrivoDestinazione,
        fine: editItem.fine,
        esito: editItem.esito,
        destinazione: editItem.destinazione,
        note: editItem.note,
        autista: editItem.autista,
        soccorritore1: editItem.soccorritore1,
        soccorritore2: editItem.soccorritore2,
        infermiere: editItem.infermiere,
        medico: editItem.medico,
        kmFinali: editItem.kmFinali,
      };
      await api.put(`/fogli-marcia/${editItem.id}`, payload);
      // refresh list
      const { data } = await api.get('/fogli-marcia', { params: { mezzo } });
      setItems(Array.isArray(data) ? data : []);
      closeEdit();
    } catch (err) {
      alert(err.response?.data?.message || 'Errore salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const delItem = async (it) => {
    if (!window.confirm(`Eliminare il foglio ${it.serviceCode || `#${it.id}`}?`)) return;
    try {
      await api.delete(`/fogli-marcia/${it.id}`);
      setItems((prev) => prev.filter((p) => p.id !== it.id));
    } catch (err) {
      alert(err.response?.data?.message || 'Errore eliminazione');
    }
  };

  return (
    <div>
      <h4 className="mb-3">Fogli di Marcia</h4>

      <div className="row g-3 align-items-end">
        <div className="col-md-6">
          <label className="form-label">🚑 Mezzo</label>
          <select
            className="form-select"
            value={mezzo}
            onChange={(e) => setMezzo(e.target.value)}
          >
            <option value="">- SELEZIONA -</option>
            <option>A03 - GG772FV - 1106</option>
            <option>A04 - GN005MH - 1284</option>
          </select>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          {!mezzo && <div className="text-muted">Seleziona un mezzo per vedere i fogli di marcia.</div>}
          {mezzo && loading && <div>Caricamento elenco...</div>}
          {mezzo && !loading && error && <div className="text-danger">{error}</div>}
          {mezzo && !loading && !error && items.length === 0 && (
            <div>Nessun foglio trovato per questo mezzo.</div>
          )}
          {mezzo && !loading && !error && items.length > 0 && (
            <div>
              {grouped.map(([dateKey, arr]) => (
                <div key={dateKey} className="mb-3">
                  <h5 className="mb-2">{dateKey}</h5>
                  <div className="table-responsive">
                    <table className="table table-sm table-hover mb-0">
                      <thead>
                        <tr>
                          <th style={{whiteSpace:'nowrap'}}>#</th>
                          <th>Indirizzo</th>
                          <th>Partenza</th>
                          <th>Fine</th>
                          <th>Esito</th>
                          <th>Tools</th>
                        </tr>
                      </thead>
                      <tbody>
                        {arr.map((f) => (
                          <tr key={f._id || f.id}>
                            <td style={{whiteSpace:'nowrap'}}>{f.serviceCode || `#${f.id}`}</td>
                            <td>{f.indirizzo || '-'}</td>
                            <td>{f.uscita || '-'}</td>
                            <td>{f.fine || '-'}</td>
                            <td>{f.esito || '-'}</td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <button className="btn btn-outline-primary" onClick={() => openEdit(f)}>Modifica</button>
                                <button className="btn btn-outline-danger" onClick={() => delItem(f)}>Elimina</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      {editItem && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifica {editItem.serviceCode || `#${editItem.id}`}</h5>
                <button type="button" className="btn-close" onClick={closeEdit} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Indirizzo</label>
                    <input className="form-control" value={editItem.indirizzo || ''} onChange={(e) => onEditField('indirizzo', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Partenza</label>
                    <input type="time" className="form-control" value={editItem.uscita || ''} onChange={(e) => onEditField('uscita', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Fine</label>
                    <input type="time" className="form-control" value={editItem.fine || ''} onChange={(e) => onEditField('fine', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Esito</label>
                    <select className="form-select" value={editItem.esito || ''} onChange={(e) => onEditField('esito', e.target.value)}>
                      <option value="">- SELEZIONA -</option>
                      <option>PS/DEA</option>
                      <option>Ospedale/Clinica</option>
                      <option>Domicilio</option>
                      <option>Presidio senza trasporto</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Destinazione</label>
                    <input className="form-control" value={editItem.destinazione || ''} onChange={(e) => onEditField('destinazione', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Note</label>
                    <textarea className="form-control" rows={2} value={editItem.note || ''} onChange={(e) => onEditField('note', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={closeEdit} disabled={saving}>Chiudi</button>
                <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>{saving ? 'Salvataggio...' : 'Salva'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FogliMarcia;
