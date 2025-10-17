import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../api';
import { getUserRole } from '../auth';

const Personale = () => {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('volontario');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    role: 'volontario',
    password: '',
    cellulare: '',
    qualifiche: [],
    stato: { volontario: false, attivo: true },
    permessi: {
      soccorsi: { inserire: false, elenco: false, ricerca: false, report: false },
      fogliMarcia: { inserire: false, elenco: false, ricerca: false, modifica: false, altro: false, tutto: false },
      consegne: { aggiungi: false },
      checklist: { nuova: false, mia: false, archivio: false },
      checklistAutisti: { nuova: false, segnalazioni: false, mia: false },
      ferie: { nuovaRichiesta: false },
      amministrazione: { utenti: false, personale: false, utif: false, materiale: false, mezzi: false, impostazioni: false }
    }
  });
  const [associate, setAssociate] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [cellulare, setCellulare] = useState('');
  const [qualifiche, setQualifiche] = useState([]);
  const [stato, setStato] = useState({ volontario: false, attivo: true });
  const [permessi, setPermessi] = useState({
    soccorsi: { inserire: false, elenco: false, ricerca: false, report: false },
    fogliMarcia: { inserire: false, elenco: false, ricerca: false, modifica: false, altro: false, tutto: false },
    consegne: { aggiungi: false },
    checklist: { nuova: false, mia: false, archivio: false },
    checklistAutisti: { nuova: false, segnalazioni: false, mia: false },
    ferie: { nuovaRichiesta: false },
    amministrazione: { utenti: false, personale: false, utif: false, materiale: false, mezzi: false, impostazioni: false }
  });
  

  useEffect(() => { document.title = 'Gestione Personale'; }, []);

  const isAdmin = getUserRole() === 'admin';

  const loadUsers = async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    setError('');
    try {
      const { data } = await api.get('/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Errore caricamento utenti');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  


  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!isAdmin) {
      setError('Solo gli amministratori possono creare utenti.');
      return;
    }

    setLoading(true);
    try {
      const payload = { nome, cognome, email, role, cellulare, qualifiche, stato, permessi };
      const { data } = await api.post('/users/invite', payload);
      setMessage(`Utente creato: ${data.user.username}. È stata inviata un'email con le credenziali.`);
      setNome(''); setCognome(''); setEmail(''); setRole('volontario');
      setCellulare('');
      setQualifiche([]);
      setStato({ volontario: false, attivo: true });
      setPermessi({
        soccorsi: { inserire: false, elenco: false, ricerca: false, report: false },
        fogliMarcia: { inserire: false, elenco: false, ricerca: false, modifica: false, altro: false, tutto: false },
        consegne: { aggiungi: false },
        checklist: { nuova: false, mia: false, archivio: false },
        checklistAutisti: { nuova: false, segnalazioni: false, mia: false },
        ferie: { nuovaRichiesta: false },
        amministrazione: { utenti: false, personale: false, utif: false, materiale: false, mezzi: false, impostazioni: false }
      });
      setAssociate(false);
      
      await loadUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Errore creazione utente';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (u) => {
    setSelectedUser(u);
    setEditUserId(u.id);
    setEditData({
      username: u.username || '',
      email: u.email || '',
      role: u.role || 'volontario',
      password: '',
      cellulare: u.cellulare || '',
      qualifiche: Array.isArray(u.qualifiche) ? u.qualifiche : [],
      stato: u.stato || { volontario: false, attivo: true },
      permessi: {
        soccorsi: {
          inserire: !!u?.permessi?.soccorsi?.inserire,
          elenco: !!u?.permessi?.soccorsi?.elenco,
          ricerca: !!u?.permessi?.soccorsi?.ricerca,
          report: !!u?.permessi?.soccorsi?.report
        },
        fogliMarcia: typeof u?.permessi?.fogliMarcia === 'object'
          ? {
              inserire: !!u.permessi.fogliMarcia.inserire,
              elenco: !!u.permessi.fogliMarcia.elenco,
              ricerca: !!u.permessi.fogliMarcia.ricerca,
              modifica: !!u.permessi.fogliMarcia.modifica,
              altro: !!u.permessi.fogliMarcia.altro,
              tutto: !!u.permessi.fogliMarcia.tutto
            }
          : { inserire: false, elenco: false, ricerca: false, modifica: false, altro: false, tutto: false },
        consegne: { aggiungi: !!u?.permessi?.consegne?.aggiungi },
        checklist: {
          nuova: !!u?.permessi?.checklist?.nuova,
          mia: !!u?.permessi?.checklist?.mia,
          archivio: !!u?.permessi?.checklist?.archivio
        },
        checklistAutisti: {
          nuova: !!u?.permessi?.checklistAutisti?.nuova,
          segnalazioni: !!u?.permessi?.checklistAutisti?.segnalazioni,
          mia: !!u?.permessi?.checklistAutisti?.mia
        },
        ferie: { nuovaRichiesta: !!u?.permessi?.ferie?.nuovaRichiesta },
        amministrazione: {
          utenti: !!u?.permessi?.amministrazione?.utenti,
          personale: !!u?.permessi?.amministrazione?.personale,
          utif: !!u?.permessi?.amministrazione?.utif,
          materiale: !!u?.permessi?.amministrazione?.materiale,
          mezzi: !!u?.permessi?.amministrazione?.mezzi,
          impostazioni: !!u?.permessi?.amministrazione?.impostazioni
        }
      }
    });
    setEditModalOpen(true);
  };

  const closeEdit = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    setEditUserId(null);
    setEditData({
      username: '',
      email: '',
      role: 'volontario',
      password: '',
      cellulare: '',
      qualifiche: [],
      stato: { volontario: false, attivo: true },
      permessi: {
        soccorsi: { inserire: false, elenco: false, ricerca: false, report: false },
        fogliMarcia: { inserire: false, elenco: false, ricerca: false, modifica: false, altro: false, tutto: false },
        consegne: { aggiungi: false },
        checklist: { nuova: false, mia: false, archivio: false },
        checklistAutisti: { nuova: false, segnalazioni: false, mia: false },
        ferie: { nuovaRichiesta: false },
        amministrazione: { utenti: false, personale: false, utif: false, materiale: false, mezzi: false, impostazioni: false }
      }
    });
  };

  const saveEdit = async (id) => {
    setError('');
    try {
      const body = {
        username: editData.username,
        email: editData.email,
        role: editData.role,
        cellulare: editData.cellulare,
        qualifiche: editData.qualifiche,
        stato: editData.stato,
        permessi: editData.permessi
      };
      await api.put(`/users/${id}`, body);
      await loadUsers();
      closeEdit();
      setMessage('Utente aggiornato');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Errore aggiornamento utente';
      setError(msg);
    }
  };

  const openSuspendConfirm = (u) => {
    setSelectedUser(u);
    setSuspendModalOpen(true);
  };

  const closeSuspendConfirm = () => {
    setSuspendModalOpen(false);
    setSelectedUser(null);
  };

  const confirmSuspend = async () => {
    if (!selectedUser) return;
    setError('');
    try {
      if (selectedUser.suspended) {
        await api.patch(`/users/${selectedUser.id}/activate`);
      } else {
        await api.patch(`/users/${selectedUser.id}/suspend`);
      }
      await loadUsers();
      closeSuspendConfirm();
    } catch (err) {
      setError('Errore aggiornamento stato utente');
    }
  };

  return (
    <div>
      <h4 className="mb-3">Gestione Personale</h4>
      {!isAdmin && (
        <div className="alert alert-warning">Solo gli amministratori possono accedere a questa sezione.</div>
      )}

      {deleteModalOpen && createPortal(
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,.5)', position: 'fixed', inset: 0, zIndex: 2100 }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Elimina utente</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setDeleteModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <p>Sei sicuro di voler eliminare definitivamente l'utente <strong>{selectedUser?.username}</strong>? Questa azione non è reversibile.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>Annulla</button>
                <button type="button" className="btn btn-danger" onClick={async () => {
                  if (!selectedUser) return;
                  setError('');
                  try {
                    await api.delete(`/users/${selectedUser.id}`);
                    await loadUsers();
                    setDeleteModalOpen(false);
                    closeEdit();
                  } catch (err) {
                    setError('Errore eliminazione utente');
                  }
                }}>Elimina</button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}

      {isAdmin && (
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <button className="btn btn-success" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Chiudi' : 'Nuovo Utente/Personale'}
          </button>
        </div>
      )}

      {isAdmin && showCreate && createPortal(
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,.5)', position: 'fixed', inset: 0, zIndex: 2000 }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document" style={{ maxWidth: '1400px', width: '95vw' }}>
            <div className="modal-content" style={{ maxHeight: '90vh' }}>
              <div className="modal-header">
                <h5 className="modal-title">Aggiungi utente</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowCreate(false)}></button>
              </div>
              <div className="modal-body" style={{ overflow: 'auto' }}>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={onSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Nome</label>
                      <input className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Cognome</label>
                      <input className="form-control" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label">Cellulare</label>
                      <input className="form-control" value={cellulare} onChange={(e) => setCellulare(e.target.value)} />
                    </div>
                    
                  </div>
                  <div className="col-12">
                    <label className="form-label">Permessi</label>
                    <div className="row g-3">
                      
                      <div className="col-12 mt-2">
                        <div className="mb-1 fw-semibold">Soccorsi</div>
                        <div className="row g-3 align-items-center">
                          {[
                            ['inserire','➕','Inserisci Soccorso'],
                            ['elenco','📋','Elenco Soccorsi'],
                            ['ricerca','🔎','Ricerca'],
                            ['report','📊','Report']
                          ].map(([k,icon,label]) => (
                            <div className="col-auto" key={`soccorsi-${k}`}>
                              <div className="form-check d-flex align-items-center gap-2">
                                <input id={`pm-soccorsi-${k}`} className="form-check-input" type="checkbox" checked={!!permessi.soccorsi?.[k]} onChange={(e) => setPermessi({ ...permessi, soccorsi: { ...permessi.soccorsi, [k]: e.target.checked } })} />
                                <label className="form-check-label d-flex align-items-center gap-1" htmlFor={`pm-soccorsi-${k}`}>
                                  <span aria-hidden="true">{icon}</span>
                                  <span>{label}</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12 mt-3">
                        <div className="mb-1 fw-semibold">Consegne</div>
                        <div className="row g-3 align-items-center">
                          {[
                            ['aggiungi','➕','Aggiungi Consegna']
                          ].map(([k,icon,label]) => (
                            <div className="col-auto" key={`consegne-${k}`}>
                              <div className="form-check d-flex align-items-center gap-2">
                                <input id={`pm-consegne-${k}`} className="form-check-input" type="checkbox" checked={!!permessi.consegne?.[k]} onChange={(e) => setPermessi({ ...permessi, consegne: { ...permessi.consegne, [k]: e.target.checked } })} />
                                <label className="form-check-label d-flex align-items-center gap-1" htmlFor={`pm-consegne-${k}`}>
                                  <span aria-hidden="true">{icon}</span>
                                  <span>{label}</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12 mt-3">
                        <div className="mb-1 fw-semibold">Check-List</div>
                        <div className="row g-3 align-items-center">
                          {[
                            ['nuova','🆕','Nuova'],
                            ['mia','👤','Visualizza “Mia Check List”'],
                            ['archivio','🗄️','Archivio']
                          ].map(([k,icon,label]) => (
                            <div className="col-auto" key={`checklist-${k}`}>
                              <div className="form-check d-flex align-items-center gap-2">
                                <input id={`pm-checklist-${k}`} className="form-check-input" type="checkbox" checked={!!permessi.checklist?.[k]} onChange={(e) => setPermessi({ ...permessi, checklist: { ...permessi.checklist, [k]: e.target.checked } })} />
                                <label className="form-check-label d-flex align-items-center gap-1" htmlFor={`pm-checklist-${k}`}>
                                  <span aria-hidden="true">{icon}</span>
                                  <span>{label}</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12 mt-3">
                        <div className="mb-1 fw-semibold">Check-List autisti</div>
                        <div className="row g-3 align-items-center">
                          {[
                            ['nuova','🆕','Nuova'],
                            ['segnalazioni','⚠️','Segnalazioni'],
                            ['mia','👤','Visualizza “Mia Check List”']
                          ].map(([k,icon,label]) => (
                            <div className="col-auto" key={`checklistAutisti-${k}`}>
                              <div className="form-check d-flex align-items-center gap-2">
                                <input id={`pm-checklistAutisti-${k}`} className="form-check-input" type="checkbox" checked={!!permessi.checklistAutisti?.[k]} onChange={(e) => setPermessi({ ...permessi, checklistAutisti: { ...permessi.checklistAutisti, [k]: e.target.checked } })} />
                                <label className="form-check-label d-flex align-items-center gap-1" htmlFor={`pm-checklistAutisti-${k}`}>
                                  <span aria-hidden="true">{icon}</span>
                                  <span>{label}</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12 mt-3">
                        <div className="mb-1 fw-semibold">Ferie</div>
                        <div className="row g-3 align-items-center">
                          {[
                            ['nuovaRichiesta','➕','Nuova Richiesta']
                          ].map(([k,icon,label]) => (
                            <div className="col-auto" key={`ferie-${k}`}>
                              <div className="form-check d-flex align-items-center gap-2">
                                <input id={`pm-ferie-${k}`} className="form-check-input" type="checkbox" checked={!!permessi.ferie?.[k]} onChange={(e) => setPermessi({ ...permessi, ferie: { ...permessi.ferie, [k]: e.target.checked } })} />
                                <label className="form-check-label d-flex align-items-center gap-1" htmlFor={`pm-ferie-${k}`}>
                                  <span aria-hidden="true">{icon}</span>
                                  <span>{label}</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12 mt-3">
                        <div className="mb-1 fw-semibold">Amministrazione</div>
                        <div className="row g-3 align-items-center">
                          {[
                            ['utenti','👤','Utenti'],
                            ['personale','🧑‍🤝‍🧑','Personale'],
                            ['utif','🧾','UTIF'],
                            ['materiale','🧰','Materiale'],
                            ['mezzi','🚐','Mezzi'],
                            ['impostazioni','⚙️','Impostazioni']
                          ].map(([k,icon,label]) => (
                            <div className="col-auto" key={`amm-${k}`}>
                              <div className="form-check d-flex align-items-center gap-2">
                                <input id={`pm-amm-${k}`} className="form-check-input" type="checkbox" checked={!!permessi.amministrazione?.[k]} onChange={(e) => setPermessi({ ...permessi, amministrazione: { ...permessi.amministrazione, [k]: e.target.checked } })} />
                                <label className="form-check-label d-flex align-items-center gap-1" htmlFor={`pm-amm-${k}`}>
                                  <span aria-hidden="true">{icon}</span>
                                  <span>{label}</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  
                  {}
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input id="assoc-toggle" className="form-check-input" type="checkbox" checked={associate} onChange={(e) => setAssociate(e.target.checked)} />
                      <label className="form-check-label" htmlFor="assoc-toggle">Associa personale</label>
                    </div>
                    {associate && (
                      <div className="mt-2 border rounded p-2">
                        <div className="mb-2 fw-semibold">Qualifiche</div>
                        <div className="row g-2 align-items-center mb-2">
                          <div className="col-12">
                            <div className="d-flex flex-wrap gap-3">
                              {['autista','soccorritore','infermiere','medico','ufficio'].map((q) => (
                                <div className="form-check" key={q}>
                                  <input id={`assoc-inline-q-${q}`} className="form-check-input" type="checkbox" checked={qualifiche.includes(q)} onChange={(e) => {
                                    if (e.target.checked) setQualifiche([...qualifiche, q]);
                                    else setQualifiche(qualifiche.filter((x) => x !== q));
                                  }} />
                                  <label className="form-check-label" htmlFor={`assoc-inline-q-${q}`}>{q.charAt(0).toUpperCase() + q.slice(1)}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2 fw-semibold">Stato</div>
                        <div className="row g-2">
                          <div className="col-auto">
                            <div className="form-check">
                              <input id="assoc-inline-st-vol" className="form-check-input" type="checkbox" checked={stato.volontario} onChange={(e) => setStato({ ...stato, volontario: e.target.checked })} />
                              <label htmlFor="assoc-inline-st-vol" className="form-check-label">Volontario</label>
                            </div>
                          </div>
                          <div className="col-auto">
                            <div className="form-check">
                              <input id="assoc-inline-st-att" className="form-check-input" type="checkbox" checked={stato.attivo} onChange={(e) => setStato({ ...stato, attivo: e.target.checked })} />
                              <label htmlFor="assoc-inline-st-att" className="form-check-label">Attivo</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Annulla</button>
                    <button className="btn btn-primary" type="submit" disabled={loading || !isAdmin}>
                      {loading ? 'Creazione...' : 'Crea utente e invia credenziali'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>, document.body
      )}

      

      {isAdmin && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Utenti/Personale</h5>
            <button className="btn btn-outline-secondary btn-sm" onClick={loadUsers} disabled={loadingUsers}>
              {loadingUsers ? 'Aggiorno...' : 'Ricarica'}
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Nome</th>
                    <th>Cognome</th>
                    <th>Email</th>
                    <th>Ruolo</th>
                    <th>Stato</th>
                    <th style={{ width: '120px' }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.nome || '-'}</td>
                      <td>{u.cognome || '-'}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        {u.suspended ? <span className="badge bg-danger">Sospeso</span> : <span className="badge bg-success">Attivo</span>}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" title="Modifica" onClick={() => openEdit(u)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-9.5 9.5L4 13l-.354-2.5 9.5-9.5z"/>
                              <path fillRule="evenodd" d="M11.207 2.5 13.5 4.793 12.5 5.793 10.207 3.5l1-1zM3 14.5l.5-3L11 4l3 3-7.5 7.5-3 .5z"/>
                            </svg>
                          </button>
                          <button className={`btn btn-sm ${u.suspended ? 'btn-success' : 'btn-warning'}`} title={u.suspended ? 'Riattiva' : 'Sospendi'} onClick={() => openSuspendConfirm(u)}>
                            {u.suspended ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.07 0l4.243-4.243a.75.75 0 1 0-1.06-1.06L7.5 9.439 4.78 6.72a.75.75 0 0 0-1.06 1.06l3.25 3.25z"/>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm3-7a.5.5 0 0 1-.5.5H5.5a.5.5 0 0 1 0-1H10.5a.5.5 0 0 1 .5.5z"/>
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">Nessun utente</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </>
      )}

      {/* Edit Modal */}
      {editModalOpen && createPortal(
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,.5)', position: 'fixed', inset: 0, zIndex: 2000 }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable" role="document" style={{ maxWidth: '1200px', width: '90vw' }}>
            <div className="modal-content" style={{ maxHeight: '90vh' }}>
              <div className="modal-header">
                <h5 className="modal-title">Modifica utente</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeEdit}></button>
              </div>
              <div className="modal-body" style={{ overflow: 'auto' }}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input className="form-control" value={editData.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ruolo</label>
                  <select className="form-select" value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })}>
                    <option value="volontario">Volontario</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Cellulare</label>
                  <input className="form-control" value={editData.cellulare} onChange={(e) => setEditData({ ...editData, cellulare: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Permessi</label>
                  <div className="row g-3">
                    
                    <div className="col-12">
                      <div className="row g-2">
                        {[
                          ['soccorsi','Soccorsi'],
                          ['consegne','Consegne'],
                          ['checklist','Check-List'],
                          ['checklistAutisti','Check-List autisti'],
                          ['ferie','Ferie'],
                          ['amministrazione','Amministrazione']
                        ].map(([key,label]) => (
                          <div className="col-auto" key={key}>
                            <div className="form-check">
                              <input id={`edit-perm-${key}`} className="form-check-input" type="checkbox" checked={!!editData.permessi?.[key]} onChange={(e) => setEditData({ ...editData, permessi: { ...editData.permessi, [key]: e.target.checked } })} />
                              <label className="form-check-label" htmlFor={`edit-perm-${key}`}>{label}</label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Qualifiche</label>
                  <div className="row g-2">
                    {['autista','soccorritore','infermiere','medico','ufficio'].map((q) => (
                      <div className="col-auto" key={q}>
                        <div className="form-check">
                          <input id={`edit-q-${q}`} className="form-check-input" type="checkbox" checked={Array.isArray(editData.qualifiche) && editData.qualifiche.includes(q)} onChange={(e) => {
                            if (e.target.checked) setEditData({ ...editData, qualifiche: [...(editData.qualifiche || []), q] });
                            else setEditData({ ...editData, qualifiche: (editData.qualifiche || []).filter((x) => x !== q) });
                          }} />
                          <label className="form-check-label" htmlFor={`edit-q-${q}`}>{q.charAt(0).toUpperCase() + q.slice(1)}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Stato</label>
                  <div className="row g-2">
                    <div className="col-auto">
                      <div className="form-check">
                        <input id="edit-st-vol" className="form-check-input" type="checkbox" checked={!!editData.stato?.volontario} onChange={(e) => setEditData({ ...editData, stato: { ...(editData.stato || {}), volontario: e.target.checked } })} />
                        <label htmlFor="edit-st-vol" className="form-check-label">Volontario</label>
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="form-check">
                        <input id="edit-st-att" className="form-check-input" type="checkbox" checked={!!editData.stato?.attivo} onChange={(e) => setEditData({ ...editData, stato: { ...(editData.stato || {}), attivo: e.target.checked } })} />
                        <label htmlFor="edit-st-att" className="form-check-label">Attivo</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-danger me-auto" onClick={() => setDeleteModalOpen(true)}>Elimina utente</button>
                <button type="button" className="btn btn-secondary" onClick={closeEdit}>Annulla</button>
                <button type="button" className="btn btn-primary" onClick={() => saveEdit(editUserId)}>Salva</button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}

      { }
      {suspendModalOpen && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedUser?.suspended ? 'Riattiva utente' : 'Sospendi utente'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeSuspendConfirm}></button>
              </div>
              <div className="modal-body">
                <p>
                  Confermi di {selectedUser?.suspended ? 'riattivare' : 'sospendere'} l'utente
                  {selectedUser ? ` "${selectedUser.username}"` : ''}?
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeSuspendConfirm}>Annulla</button>
                <button type="button" className={`btn ${selectedUser?.suspended ? 'btn-success' : 'btn-warning'}`} onClick={confirmSuspend}>
                  {selectedUser?.suspended ? 'Riattiva' : 'Sospendi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personale;
