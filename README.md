# 🚑 Croce d'Oro – Gestione Interventi

Applicazione web sviluppata per supportare la **Croce d’Oro Sud Pontino** nella gestione quotidiana delle attività operative. Il progetto nasce con l’obiettivo di semplificare la pianificazione, il monitoraggio e la documentazione degli interventi, migliorando l’efficienza organizzativa e riducendo i margini di errore.

---

## 🌐 Parte pubblica

La sezione pubblica è accessibile senza autenticazione ed è pensata per offrire trasparenza e informazioni utili ai cittadini, volontari e collaboratori esterni.

### Funzionalità

- 📰 Visualizzazione degli interventi recenti (in forma aggregata o anonima)
- 📅 Calendario delle attività
- 📍 Informazioni sull’associazione e sui servizi offerti
- 📄 Accesso a documenti pubblici (moduli, informative, regolamenti)
- 📌 Form di contatto per richieste o segnalazioni

Questa sezione è sviluppata con React e Vite, e comunica con il backend tramite API REST.

---

## 🔐 Parte riservata

La sezione riservata è accessibile solo previa autenticazione e consente la gestione operativa interna dell’organizzazione.

### Funzionalità

- 👥 Gestione utenti: creazione, modifica, assegnazione ruoli
- 🚨 Interventi: registrazione, aggiornamento stato, storico
- 📆 Dashboard operativa: panoramica giornaliera e settimanale
- 🖼️ Upload immagini con Cloudinary
- 📧 Email automatiche con Nodemailer
- 🔐 Login sicuro con JWT

> ⚠️ **Nota sulla privacy**  
> Per motivi di riservatezza, i nomi e i dati personali presenti nella sezione riservata **non corrispondono a persone reali**. Sono stati utilizzati esclusivamente **placeholder fittizi** a scopo dimostrativo.

---

## 🛠️ Tecnologie utilizzate

### Backend

- Node.js con Express
- MongoDB
- JWT (JSON Web Token)
- Nodemailer
- Cloudinary

### Frontend

- React con Vite
- Bootstrap
- Axios
- React Router

---
