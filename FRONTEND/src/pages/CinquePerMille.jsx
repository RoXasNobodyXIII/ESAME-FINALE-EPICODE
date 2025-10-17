import React, { useEffect } from 'react';

const CinquePerMille = () => {
  useEffect(() => {
    document.title = "5 x mille";
  }, []);

  return (
    <div className="container mt-5">
      <h2>5 x mille</h2>
      <p className="text-muted">Sostieni la Croce d'Oro Sud Pontino destinando il tuo 5 x mille. Codice fiscale: <strong>INSERT-CF</strong>.</p>
    </div>
  );
};

export default CinquePerMille;
