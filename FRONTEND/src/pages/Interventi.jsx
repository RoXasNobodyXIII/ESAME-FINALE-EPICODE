import React, { useEffect } from 'react';

const Interventi = () => {
  useEffect(() => {
    document.title = 'Interventi';
  }, []);
  return (
    <div>
      <h4>Archivio interventi</h4>
      <p className="text-muted">Elenco interventi con filtri e ricerca – integrazione API da implementare.</p>
    </div>
  );
};

export default Interventi;
