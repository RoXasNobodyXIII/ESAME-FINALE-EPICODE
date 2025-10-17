import React, { useEffect } from 'react';

const AdminMateriale = () => {
  useEffect(() => { document.title = 'Amministrazione - Materiale'; }, []);
  return (
    <div>
      <h4 className="mb-3">Amministrazione · Materiale</h4>
      <div className="alert alert-info">Pagina Materiale (sezione amministrativa). Contenuti da implementare.</div>
    </div>
  );
};

export default AdminMateriale;
