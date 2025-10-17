import React, { useEffect } from 'react';

const AdminMezzi = () => {
  useEffect(() => { document.title = 'Amministrazione - Mezzi'; }, []);
  return (
    <div>
      <h4 className="mb-3">Amministrazione · Mezzi</h4>
      <div className="alert alert-info">Pagina Mezzi (sezione amministrativa). Contenuti da implementare.</div>
    </div>
  );
};

export default AdminMezzi;
