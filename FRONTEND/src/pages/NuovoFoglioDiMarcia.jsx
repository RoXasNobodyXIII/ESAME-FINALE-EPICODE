import React, { useEffect, useState } from 'react';
import api from '../api';

const NuovoFoglioDiMarcia = () => {
  useEffect(() => {
    document.title = "Foglio Marcia";
  }, []);

  const [form, setForm] = useState({
    tipologiaServizio: 'Servizio Secondario',
    postazione: '',
    missione118: '',
    data: '',
    richiestoDa: '',
    motivoServizio: '',
    cognome: '',
    nome: '',
    sesso: '',
    annoNascita: '',
    indirizzo: '',
    comune: '',
    esito: '',
    destinazione: '',
    uscita: '',
    sulPosto: '',
    arrivoDestinazione: '',
    fine: '',
    mezzo: '',
    kmIniziali: '',
    kmFinali: '',
    autista: '',
    soccorritore1: '',
    soccorritore2: '',
    infermiere: '',
    medico: '',
    note: '',
  });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitOk, setSubmitOk] = useState('');
  const [odoLoading, setOdoLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitOk('');
    // client-side check
    const ki = Number(form.kmIniziali);
    const kf = Number(form.kmFinali);
    if (Number.isFinite(ki) && Number.isFinite(kf) && kf < ki) {
      setSubmitError('I Km finali non possono essere inferiori ai Km iniziali.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/fogli-marcia', form);
      const code = data.serviceCode || `#${data.id}`;
      setSubmitOk(`Creato foglio ${code}`);
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      const apiDetail = err.response?.data?.error;
      const text = apiMsg || apiDetail || err.message || 'Errore durante il salvataggio';
      setSubmitError(text);
    } finally {
      setSubmitting(false);
    }
  };


  // km mezzo
  useEffect(() => {
    const m = (form.mezzo || '').trim();
    if (!m) return;
    setOdoLoading(true);
    api.get('/fogli-marcia/odometer', { params: { mezzo: m } })
      .then(({ data }) => {
        setForm((f) => ({ ...f, kmIniziali: data?.currentKm ?? '' }));
      })
      .catch(() => { })
      .finally(() => setOdoLoading(false));
  }, [form.mezzo]);

  return (
    <div>
      <h4 className="mb-3">Foglio Marcia</h4>
      {submitError && <div className="alert alert-danger">{submitError}</div>}
      {submitOk && <div className="alert alert-success">{submitOk}</div>}
      <form onSubmit={onSubmit}>
        <div className="row g-3">
          {/* Tipologia servizio */}
          <div className="col-md-6">
            <label className="form-label">📌 Tipologia servizio</label>
            <input className="form-control" value={form.tipologiaServizio} readOnly />
          </div>
          {/* Data */}
          <div className="col-md-6">
            <label className="form-label">📆 Data</label>
            <input type="date" className="form-control" value={form.data} onChange={(e) => setField('data', e.target.value)} required />
          </div>
          {/* Richiesto da */}
          <div className="col-md-6">
            <label className="form-label">🗣 Richiesto da</label>
            <select className="form-select" value={form.richiestoDa} onChange={(e) => setField('richiestoDa', e.target.value)} required>
              <option value="">- SELEZIONA -</option>
              <option>Familiari</option>
              <option>Servizi sociali</option>
              <option>Andata/ritorno postazione</option>
              <option>Altro</option>
            </select>
          </div>
          {/* Motivo*/}
          <div className="col-md-6">
            <label className="form-label">💬 Motivo del servizio</label>
            <select className="form-select" value={form.motivoServizio} onChange={(e) => setField('motivoServizio', e.target.value)} required>
              <option value="">- SELEZIONA -</option>
              <option>Visita</option>
              <option>Trasferimento</option>
              <option>Ricovero o Dimissione</option>
              <option>Andata postazione</option>
              <option>Ritorno postazione</option>
              <option>Presidio</option>
              <option>Assist. o Manuten.</option>
            </select>
          </div>
          {/* Dati anagrafici */}
          <div className="col-md-6">
            <label className="form-label">👤 Cognome</label>
            <input className="form-control" value={form.cognome} onChange={(e) => setField('cognome', e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">👤 Nome</label>
            <input className="form-control" value={form.nome} onChange={(e) => setField('nome', e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">🚻 Sesso</label>
            <select className="form-select" value={form.sesso} onChange={(e) => setField('sesso', e.target.value)} required>
              <option value="">- SELEZIONA -</option>
              <option>M</option>
              <option>F</option>
              <option>NR</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">🔢 Anno di nascita</label>
            <input type="number" className="form-control" min="1900" max={new Date().getFullYear()} value={form.annoNascita} onChange={(e) => setField('annoNascita', e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">🗺 Indirizzo</label>
            <input className="form-control" value={form.indirizzo} onChange={(e) => setField('indirizzo', e.target.value)} />
          </div>
          {/* Comune */}
          <div className="col-12">
            <label className="form-label">📍 Comune</label>
            <input className="form-control" list="comuni-suggeriti" placeholder="Digita il comune" value={form.comune} onChange={(e) => setField('comune', e.target.value)} />
            <datalist id="comuni-suggeriti">
              <option value="Latina" />
              <option value="Formia" />
              <option value="Gaeta" />
              <option value="Sperlonga" />
              <option value="Terracina" />
            </datalist>
          </div>
          {/* Esito e destinazione */}
          <div className="col-md-6">
            <label className="form-label">📥 Esito</label>
            <select className="form-select" value={form.esito} onChange={(e) => setField('esito', e.target.value)}>
              <option value="">- SELEZIONA -</option>
              <option>PS/DEA</option>
              <option>Ospedale/Clinica</option>
              <option>Domicilio</option>
              <option>Presidio senza trasporto</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">🗺 Destinazione</label>
            <input className="form-control" value={form.destinazione} onChange={(e) => setField('destinazione', e.target.value)} />
          </div>
          {/* Tempi */}
          <div className="col-md-3">
            <label className="form-label">🕐 Uscita</label>
            <input type="time" className="form-control" value={form.uscita} onChange={(e) => setField('uscita', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">🕒 Sul posto</label>
            <input type="time" className="form-control" value={form.sulPosto} onChange={(e) => setField('sulPosto', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">🕗 Arrivo Destinazione</label>
            <input type="time" className="form-control" value={form.arrivoDestinazione} onChange={(e) => setField('arrivoDestinazione', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">🕚 Fine</label>
            <input type="time" className="form-control" value={form.fine} onChange={(e) => setField('fine', e.target.value)} />
          </div>

          {/* Mezzo e KM */}
          <div className="col-md-6">
            <label className="form-label">🚑 Mezzo</label>
            <select className="form-select" value={form.mezzo} onChange={(e) => setField('mezzo', e.target.value)}>
              <option value="">- SELEZIONA -</option>
              <option>A03 - GG772FV - 1106</option>
              <option>A04 - GN005MH - 1284</option>
            </select>
            {odoLoading && <div className="form-text">Lettura chilometraggio...</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label">🛫 Km iniziali</label>
            <input type="number" className="form-control" value={form.kmIniziali} onChange={(e) => setField('kmIniziali', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">🛬 Km finali</label>
            <input type="number" className="form-control" value={form.kmFinali} onChange={(e) => setField('kmFinali', e.target.value)} />
          </div>


          {/* Equipaggio */}
          <div className="col-md-6">
            <label className="form-label">🚔 Autista</label>
            <input className="form-control" placeholder="Inserisci nome" value={form.autista} onChange={(e) => setField('autista', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">⛑ Soccorritore 1</label>
            <input className="form-control" placeholder="Inserisci nome" value={form.soccorritore1} onChange={(e) => setField('soccorritore1', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">⛑ Soccorritore 2</label>
            <input className="form-control" placeholder="Inserisci nome" value={form.soccorritore2} onChange={(e) => setField('soccorritore2', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">💉 Infermiere</label>
            <input className="form-control" placeholder="Inserisci nome" value={form.infermiere} onChange={(e) => setField('infermiere', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">🧑‍⚕️ Medico</label>
            <input className="form-control" placeholder="Inserisci nome" value={form.medico} onChange={(e) => setField('medico', e.target.value)} />
          </div>

          {/* Note */}
          <div className="col-12">
            <label className="form-label">🗒 Note</label>
            <textarea className="form-control" rows={3} placeholder="Non aggiungere qui liste di utenti; usa solo note sul servizio." value={form.note} onChange={(e) => setField('note', e.target.value)} />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3 gap-2">
          <button type="reset" className="btn btn-outline-secondary" onClick={() => setForm({
            tipologiaServizio: '', postazione: '', missione118: '', data: '', richiestoDa: '', motivoServizio: '', cognome: '', nome: '', sesso: '', annoNascita: '', indirizzo: '', comune: '', esito: '', destinazione: '', uscita: '', sulPosto: '', arrivoDestinazione: '', fine: '', mezzo: '', kmIniziali: '', kmFinali: '', autista: '', soccorritore1: '', soccorritore2: '', infermiere: '', medico: '', note: ''
          })}>Annulla</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Salvataggio...' : 'Salva'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuovoFoglioDiMarcia;
