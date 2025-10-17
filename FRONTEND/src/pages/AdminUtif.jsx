import React, { useEffect } from 'react';

const AdminUtif = () => {
  useEffect(() => { document.title = 'Amministrazione - UTIF'; }, []);
  return (
    <div>
      <h4 className="mb-3">Amministrazione · UTIF</h4>
      <div className="alert alert-info">Pagina UTIF (sezione amministrativa). Contenuti da implementare.</div>
    </div>
  );
};

export default AdminUtif;
