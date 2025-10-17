import React from 'react';
import Footer from './footer.jsx';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import PrivateDashboard from './pages/PrivateDashboard.jsx';
import Calendar from './pages/Calendar.jsx';
import Magazzino from './pages/Magazzino.jsx';
import Interventi from './pages/Interventi.jsx';
import Documenti from './pages/Documenti.jsx';
import { clearTokens } from './auth';
import NuovoFoglioDiMarcia from './pages/NuovoFoglioDiMarcia.jsx';
import FogliMarcia from './pages/FogliMarcia.jsx';
import Personale from './pages/Personale.jsx';
import AdminPersonale from './pages/AdminPersonale.jsx';
import AdminUtif from './pages/AdminUtif.jsx';
import AdminMateriale from './pages/AdminMateriale.jsx';
import AdminMezzi from './pages/AdminMezzi.jsx';
import AdminImpostazioni from './pages/AdminImpostazioni.jsx';
import Mezzi from './pages/Mezzi.jsx';
import CinquePerMille from './pages/CinquePerMille.jsx';
import StrutturaOrganizzativa from './pages/StrutturaOrganizzativa.jsx';
import Corsi from './pages/Corsi.jsx';
import DiventareVolontario from './pages/DiventareVolontario.jsx';
import RichiedereServizio from './pages/RichiedereServizio.jsx';
import ChiSiamo from './pages/ChiSiamo.jsx';
import News from './pages/News.jsx';
import Galleria from './pages/Galleria.jsx';
import RicercaFogliMarcia from './pages/RicercaFogliMarcia.jsx';
import ReportFogliMarcia from './pages/ReportFogliMarcia.jsx';

const App = () => {
    const location = useLocation();
    const isPrivate = location.pathname.startsWith('/private');
    const onLogout = () => {
        clearTokens();
        window.location.href = '/login';
    };

    React.useEffect(() => {
        const collapse = document.getElementById('navbarNav');
        if (!collapse) return;
        const handler = (e) => {
            const link = e.target.closest('a, button');
            if (!link) return;
            if (collapse.classList.contains('show')) {
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler) toggler.click();
            }
        };
        collapse.addEventListener('click', handler);
        return () => collapse.removeEventListener('click', handler);
    }, [location.pathname]);

    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    {isPrivate ? (
                        <Link className="navbar-brand d-flex align-items-center" to="/private">
                            <img
                                src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1760208659/LOGO_CROCE_yzhmab.jpg"
                                alt="Croce d'Oro Sud Pontino logo"
                                className="me-2"
                            />
                            Area Privata
                        </Link>
                    ) : (
                        <Link className="navbar-brand d-flex align-items-center" to="/">
                            <img
                                src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1760208659/LOGO_CROCE_yzhmab.jpg"
                                alt="Croce d'Oro Sud Pontino logo"
                                className="me-2"
                            />
                            {"Croce d'Oro Sud Pontino"}
                        </Link>
                    )}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="nav navbar-nav ms-auto">
                            {isPrivate ? (
                                <>
                                    <li className="nav-item">
                                        <button className="btn btn-danger ms-2" onClick={onLogout}>Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/news">News/Attività</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/galleria">Galleria</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/mezzi">Mezzi</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/5x1000">5 x mille</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/struttura-organizzativa">Struttura Organizzativa</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/corsi">I Nostri Corsi</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/diventare-volontario">Diventa uno di noi</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/richiedere-servizio">Richiedi Servizio</Link>
                                    </li>
                                    
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="flex-grow-1">
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="container-xxl mt-5">
                            <div className="row">
                                <div className="col-lg-8 mb-4">
                                    <div className="ps-0 pe-4 pt-0 pb-5">
                                        <h1 className="display-4">Croce d'Oro Sud Pontino ONLUS</h1>
                                        <p className="lead">Organizzazione Non-Profit di Volontariato costituita per dotare del servizio di Protezione Civile nei Comuni di Sperlonga e Campodimele e le altre attività inerenti.</p>
                                        <hr className="my-4" />
                                        <h2>I Nostri Servizi</h2>
                                        <div className="row mt-4">
                                            <div className="col-md-6 mb-3">
                                                <div className="d-flex align-items-start">
                                                    <span className="fs-2 me-3">🚨</span>
                                                    <div>
                                                        <h5>Servizio di emergenza in convenzione con ARES 118 (H24) – Postazione di Gaeta</h5>
                                                        <p>Operiamo 24 ore su 24 per garantire interventi tempestivi in caso di emergenza sanitaria.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <div className="d-flex align-items-start">
                                                    <span className="fs-2 me-3">🚑</span>
                                                    <div>
                                                        <h5>Trasporto e trasferimento di infermi</h5>
                                                        <p>Effettuiamo dimissioni, trasporti tra strutture sanitarie, ricoveri programmati e accompagnamenti per visite specialistiche o terapie, assicurando assistenza qualificata e mezzi idonei alle esigenze del paziente.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <div className="d-flex align-items-start">
                                                    <span className="fs-2 me-3">🎪</span>
                                                    <div>
                                                        <h5>Assistenza a manifestazioni/eventi</h5>
                                                        <p>Forniamo supporto sanitario con personale qualificato e mezzi attrezzati durante eventi pubblici e privati.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <div className="d-flex align-items-start">
                                                    <span className="fs-2 me-3">🤝</span>
                                                    <div>
                                                        <h5>Appartenenza all’ANPAS nazionale e regionale</h5>
                                                        <p>Facciamo orgogliosamente parte di ANPAS, l’Associazione Nazionale Pubbliche Assistenze, che riunisce realtà impegnate nel volontariato, nella solidarietà e nella protezione civile.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h2>Attività recenti</h2>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="card-title">Corso di Primo Soccorso</h5>
                                                        <p className="card-text">Organizzato un corso di formazione per volontari sulla gestione delle emergenze mediche.</p>
                                                        <a href="/news.html" className="btn btn-primary">Scopri di più</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="card-title">Intervento in Emergenza</h5>
                                                        <p className="card-text">Partecipazione attiva durante l'ultima alluvione per assistenza alla popolazione.</p>
                                                        <a href="/galleria.html" className="btn btn-primary">Vedi foto</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="card-title">Giornata di Solidarietà</h5>
                                                        <p className="card-text">Evento comunitario per raccogliere fondi e sensibilizzare sulla protezione civile.</p>
                                                        <a href="/news.html" className="btn btn-primary">Scopri di più</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="card">
                                        <div className="card-body p-2" style={{ maxHeight: '600px', overflow: 'hidden' }}>
                                            <div className="ratio" style={{ '--bs-aspect-ratio': '125%', maxHeight: '600px' }}>
                                                <iframe
                                                    src="https://www.instagram.com/crocedorosudpontino/embed"
                                                    title="Instagram Croce d'Oro Sud Pontino"
                                                    allowTransparency={true}
                                                    frameBorder="0"
                                                    scrolling="no"
                                                    style={{ width: '100%', height: '100%', border: 0 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mt-3">
                                        <div className="card-body p-2" style={{ height: '140px' }}>
                                            <iframe
                                                title="Facebook Croce d'Oro Sud Pontino"
                                                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcrocedorosudpontino&tabs=&width=500&height=140&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0, overflow: 'hidden' }}
                                                scrolling="no"
                                                frameBorder="0"
                                                allow="encrypted-media"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                />

                <Route path="/mezzi" element={<Mezzi />} />
                <Route path="/5x1000" element={<CinquePerMille />} />
                <Route path="/struttura-organizzativa" element={<StrutturaOrganizzativa />} />
                <Route path="/corsi" element={<Corsi />} />
                <Route path="/diventare-volontario" element={<DiventareVolontario />} />
                <Route path="/richiedere-servizio" element={<RichiedereServizio />} />
                <Route path="/chi-siamo" element={<ChiSiamo />} />
                <Route path="/news" element={<News />} />
                <Route path="/galleria" element={<Galleria />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/private"
                    element={
                        <ProtectedRoute>
                            <PrivateDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="calendar" replace />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="magazzino" element={<Magazzino />} />
                    <Route path="interventi" element={<Interventi />} />
                    <Route path="documenti" element={<Documenti />} />
                    <Route path="fogli-marcia" element={<FogliMarcia />} />
                    <Route path="nuovo-foglio" element={<NuovoFoglioDiMarcia />} />
                    <Route path="fogli-marcia/ricerca" element={<RicercaFogliMarcia />} />
                    <Route path="fogli-marcia/report" element={<ReportFogliMarcia />} />
                    <Route path="tools/amministrazione/utenti" element={<ProtectedRoute roles={['admin']}><Personale /></ProtectedRoute>} />
                    <Route path="tools/amministrazione/personale" element={<ProtectedRoute roles={['admin']}><AdminPersonale /></ProtectedRoute>} />
                    <Route path="tools/amministrazione/utif" element={<ProtectedRoute roles={['admin']}><AdminUtif /></ProtectedRoute>} />
                    <Route path="tools/amministrazione/materiale" element={<ProtectedRoute roles={['admin']}><AdminMateriale /></ProtectedRoute>} />
                    <Route path="tools/amministrazione/mezzi" element={<ProtectedRoute roles={['admin']}><AdminMezzi /></ProtectedRoute>} />
                    <Route path="tools/amministrazione/impostazioni" element={<ProtectedRoute roles={['admin']}><AdminImpostazioni /></ProtectedRoute>} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </div>

            {!isPrivate && <Footer />}

        </div>
    );
};

export default App;
