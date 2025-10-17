import React from 'react';

const News = () => {
  return (
    <div className="container mt-5">
      <h1>News/Attività</h1>
      <div className="list-group">
        <a href="#" className="list-group-item list-group-item-action">
          <h5 className="mb-1">Corso di Primo Soccorso - 10 Marzo 2024</h5>
          <p className="mb-1">Abbiamo organizzato un corso di primo soccorso per formare nuovi volontari e aggiornare quelli esistenti.</p>
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <h5 className="mb-1">Intervento durante l'alluvione - 5 Febbraio 2024</h5>
          <p className="mb-1">Il nostro team ha partecipato attivamente all'assistenza della popolazione colpita dall'alluvione.</p>
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <h5 className="mb-1">Giornata di Solidarietà - 20 Gennaio 2024</h5>
          <p className="mb-1">Evento per raccogliere fondi e sensibilizzare la comunità sull'importanza della protezione civile.</p>
        </a>
      </div>
    </div>
  );
};

export default News;
