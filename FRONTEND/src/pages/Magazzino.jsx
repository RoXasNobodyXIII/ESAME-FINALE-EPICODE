import React, { useEffect } from 'react';

const Magazzino = () => {
  useEffect(() => {
    document.title = 'Magazzino';
  }, []);
  return (
    <div>
      <h4>Magazzino</h4>
      <p className="text-muted">CRUD materiali/dispositivi (lista, aggiungi, modifica, elimina) – integrazione API da implementare.</p>
    </div>
  );
};

export default Magazzino;
