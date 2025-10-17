import React, { useEffect } from 'react';

const AdminImpostazioni = () => {
  useEffect(() => { document.title = 'Amministrazione - Impostazioni'; }, []);
  return (
    <div>
      <h4 className="mb-3">Amministrazione · Impostazioni</h4>
      <div className="alert alert-info">Pagina Impostazioni (sezione amministrativa). Contenuti da implementare.</div>
    </div>
  );
};

export default AdminImpostazioni;
