import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { clearTokens, getUserRole } from '../auth';

const NavItem = ({ to, label }) => {
  const location = useLocation();
  const active = location.pathname.startsWith(to);
  return (
    <li className="nav-item me-2 mb-2">
      <Link className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-primary'}`} to={to}>
        {label}
      </Link>
    </li>
  );
};

const PrivateDashboard = () => {
  const role = getUserRole();
  const location = useLocation();
  const isUtenti = location.pathname.startsWith('/private/tools/amministrazione/utenti');

  useEffect(() => {
    const path = location.pathname;
    let section = 'Area Riservata';
    if (path.includes('/private/calendar')) section = 'Calendario turni';
    else if (path.includes('/private/magazzino')) section = 'Magazzino';
    else if (path.includes('/private/interventi')) section = 'Interventi';
    else if (path.includes('/private/documenti')) section = 'Documentazione';
    else if (path.includes('/private/fogli-marcia')) section = 'Fogli di Marcia';
    else if (path.includes('/private/nuovo-foglio')) section = 'Foglio Marcia';
    document.title = `${section} - Croce d'Oro Sud Pontino`;
  }, [location.pathname]);

  const isAdmin = role === 'admin';
  const showTools = isAdmin;


  return (
    <div className={isUtenti ? "container-fluid mt-4" : "container mt-4"}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Area Riservata {role ? `- ${role}` : ''}</h2>
      </div>

      <ul className="nav flex-wrap mb-3">
        <NavItem to="/private/calendar" label="Calendario turni" />
        <NavItem to="/private/magazzino" label="Magazzino" />
        <NavItem to="/private/interventi" label="Interventi" />
        <NavItem to="/private/documenti" label="Documentazione" />
        <li className="nav-item dropdown me-2 mb-2">
          <button
            className={`btn btn-sm dropdown-toggle ${
              location.pathname.startsWith('/private/nuovo-foglio') || location.pathname.startsWith('/private/fogli-marcia')
                ? 'btn-primary'
                : 'btn-outline-primary'
            }`}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Foglio Marcia
          </button>
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="/private/nuovo-foglio">Crea Foglio</Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/private/fogli-marcia">Elenco Fogli</Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/private/fogli-marcia/ricerca">Ricerca</Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/private/fogli-marcia/report">Report</Link>
            </li>
          </ul>
        </li>
        {showTools && (
          <li className="nav-item dropdown me-2 mb-2">
            <button
              className={`btn btn-sm dropdown-toggle ${
                location.pathname.startsWith('/private/tools') ? 'btn-primary' : 'btn-outline-primary'
              }`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Tools
            </button>
            <ul className="dropdown-menu">
              <li><h6 className="dropdown-header">Amministrazione</h6></li>
              <li><Link className="dropdown-item" to="/private/tools/amministrazione/utenti">Utenti</Link></li>
              <li><Link className="dropdown-item" to="/private/tools/amministrazione/personale">Personale</Link></li>
              <li><Link className="dropdown-item" to="/private/tools/amministrazione/utif">UTIF</Link></li>
              <li><Link className="dropdown-item" to="/private/tools/amministrazione/materiale">Materiale</Link></li>
              <li><Link className="dropdown-item" to="/private/tools/amministrazione/mezzi">Mezzi</Link></li>
              <li><Link className="dropdown-item" to="/private/tools/amministrazione/impostazioni">Impostazioni</Link></li>
            </ul>
          </li>
        )}
      </ul>

      <div className="card" style={isUtenti ? { overflow: 'visible', maxWidth: '1800px', margin: '0 auto' } : undefined}>
        <div className="card-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrivateDashboard;
