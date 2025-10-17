import React, { useEffect } from 'react';

const Documenti = () => {
  useEffect(() => {
    document.title = 'Documentazione';
  }, []);
  return (
    <div>
      <h4>Documentazione interna</h4>
      <p className="text-muted">Upload/download documenti – gestione permessi e integrazione API da implementare.</p>
    </div>
  );
};

export default Documenti;
