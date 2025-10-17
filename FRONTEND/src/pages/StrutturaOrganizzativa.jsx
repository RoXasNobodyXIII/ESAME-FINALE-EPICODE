import React, { useEffect } from 'react';

const StrutturaOrganizzativa = () => {
  useEffect(() => {
    document.title = "Struttura Organizzativa";
  }, []);
  const imageUrl = "https://res.cloudinary.com/dkbahjqa6/image/upload/v1760607657/user_lynu20.png";

  return (
    <div className="container mt-5">
      <h2>Struttura Organizzativa</h2>
      <div className="mt-4">
        <h3>Il Consiglio Direttivo</h3>
        <p className="mb-3">Eletto il 26 settembre 2022, il Consiglio Direttivo della nostra Associazione, insieme ai volontari e a tutti i soci, lavora con impegno e passione per favorire la crescita e il benessere della nostra comunità ed è composto da:</p>
        <div className="row row-cols-1 row-cols-md-2 g-3">
          <div className="col">
            <div className="card h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">Presidente</h5>
                  <p className="card-text">Mati Simone</p>
                </div>
                <img src={imageUrl} alt="" className="ms-3" style={{ width: '56px', height: '56px' }} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">Vicepresidente</h5>
                  <p className="card-text">De Parolis Alessandro</p>
                </div>
                <img src={imageUrl} alt="" className="ms-3" style={{ width: '56px', height: '56px' }} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">Segretaria</h5>
                  <p className="card-text">Di Fonzo Amelia</p>
                </div>
                <img src={imageUrl} alt="" className="ms-3" style={{ width: '56px', height: '56px' }} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">Tesoriere</h5>
                  <p className="card-text">Galli Andrea</p>
                </div>
                <img src={imageUrl} alt="" className="ms-3" style={{ width: '56px', height: '56px' }} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">Consigliere</h5>
                  <p className="card-text">Grossi Tullio Gianmarco</p>
                </div>
                <img src={imageUrl} alt="" className="ms-3" style={{ width: '56px', height: '56px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrutturaOrganizzativa;
