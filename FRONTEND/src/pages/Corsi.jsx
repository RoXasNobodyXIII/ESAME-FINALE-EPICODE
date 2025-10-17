import React, { useEffect } from 'react';

const Corsi = () => {
  useEffect(() => {
    document.title = "I nostri Corsi";
  }, []);

  return (
    <div className="container mt-5">
      <h2>I nostri Corsi</h2>
      <p className="text-muted">Informazioni sui corsi: PBLSD, PTC, corso soccorritore e formazione per la comunità.</p>

      <div className="mt-4">
        <h3>Corsi di educazione sanitaria e di Primo Soccorso</h3>
        <p>
          Organizziamo corsi di formazione e aggiornamento in collaborazione con <strong>CSE FORMAZIONE</strong> rivolti sia al personale sanitario che alla popolazione,
          con l’obiettivo di diffondere la cultura della prevenzione, del primo soccorso e della sicurezza, migliorando la capacità di intervento e di aiuto reciproco in ogni situazione di emergenza.
        </p>
      </div>
    </div>
  );
};

export default Corsi;
