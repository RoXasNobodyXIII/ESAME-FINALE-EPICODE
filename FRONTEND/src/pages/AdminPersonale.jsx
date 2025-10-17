import React, { useEffect } from 'react';

const AdminPersonale = () => {
  useEffect(() => { document.title = 'Amministrazione - Personale'; }, []);
  return (
    <div>
      <h4 className="mb-3">Amministrazione · Personale</h4>
      <div className="alert alert-info">Pagina Personale (sezione amministrativa). Contenuti da implementare.</div>
    </div>
  );
};

export default AdminPersonale;
