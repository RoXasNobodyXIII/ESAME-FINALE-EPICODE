import React, { useEffect } from 'react';

const DiventareVolontario = () => {
  useEffect(() => {
    document.title = "Diventa uno di noi";
  }, []);

  return (
    <div className="container mt-5">
      <h2>Diventa uno di noi</h2>
      <p className="text-muted">Requisiti, iter di iscrizione, formazione iniziale e contatti per candidarsi come volontario.</p>
      <div className="mt-4">
        <a href="/moduli/modulo-iscrizione.pdf" className="btn btn-primary" download>
          Scarica modulo di iscrizione (PDF)
        </a>
      </div>
    </div>
  );
};

export default DiventareVolontario;
