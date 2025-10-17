import React, { useEffect } from 'react';

const Mezzi = () => {
  useEffect(() => {
    document.title = "Mezzi";
  }, []);

  return (
    <div className="container mt-5">
      <h2> I Nostri Mezzi</h2>

      <div className="card mt-3">
        <div className="card-body">
          <p className="mb-3">
            La nostra Associazione dispone di un parco macchine composto da:
          </p>
          <ul className="mb-0">
            <li>N. 3 Autoambulanze</li>
            <li>2 Boxer Peugeot</li>
            <li>1 Fiat Ducato</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mezzi;
