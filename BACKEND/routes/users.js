const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { sendMail } = require('../services/email');
const crypto = require('crypto');
const router = express.Router();
const APP_PUBLIC_URL = process.env.APP_PUBLIC_URL || process.env.FRONTEND_URL || '';

// MongoDB 
function getUsersCol(req) {
  return req.app.locals.db.collection('users');
}


const userValidationRules = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters if provided'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('role').isIn(['admin', 'volontario']).withMessage('Role must be admin or volontario'),
  // optional fields
  body('cellulare').optional().isString().trim(),
  body('qualifiche').optional().isArray(),
  body('qualifiche.*').optional().isIn(['autista','soccorritore','infermiere','medico','ufficio']).withMessage('Qualifica non valida'),
  body('stato.volontario').optional().isBoolean().toBoolean(),
  body('stato.attivo').optional().isBoolean().toBoolean(),
  body('permessi.soccorsi').optional().isObject(),
  body('permessi.soccorsi.inserire').optional().isBoolean().toBoolean(),
  body('permessi.soccorsi.elenco').optional().isBoolean().toBoolean(),
  body('permessi.soccorsi.ricerca').optional().isBoolean().toBoolean(),
  body('permessi.soccorsi.report').optional().isBoolean().toBoolean(),
  body('permessi.fogliMarcia').optional().isObject(),
  body('permessi.fogliMarcia.inserire').optional().isBoolean().toBoolean(),
  body('permessi.fogliMarcia.elenco').optional().isBoolean().toBoolean(),
  body('permessi.fogliMarcia.ricerca').optional().isBoolean().toBoolean(),
  body('permessi.fogliMarcia.modifica').optional().isBoolean().toBoolean(),
  body('permessi.fogliMarcia.altro').optional().isBoolean().toBoolean(),
  body('permessi.fogliMarcia.tutto').optional().isBoolean().toBoolean(),
  body('permessi.consegne').optional().isObject(),
  body('permessi.consegne.aggiungi').optional().isBoolean().toBoolean(),
  body('permessi.checklist').optional().isObject(),
  body('permessi.checklist.nuova').optional().isBoolean().toBoolean(),
  body('permessi.checklist.mia').optional().isBoolean().toBoolean(),
  body('permessi.checklist.archivio').optional().isBoolean().toBoolean(),
  body('permessi.checklistAutisti').optional().isObject(),
  body('permessi.checklistAutisti.nuova').optional().isBoolean().toBoolean(),
  body('permessi.checklistAutisti.segnalazioni').optional().isBoolean().toBoolean(),
  body('permessi.checklistAutisti.mia').optional().isBoolean().toBoolean(),
  body('permessi.ferie').optional().isObject(),
  body('permessi.ferie.nuovaRichiesta').optional().isBoolean().toBoolean(),
  body('permessi.amministrazione').optional().isObject(),
  body('permessi.amministrazione.utenti').optional().isBoolean().toBoolean(),
  body('permessi.amministrazione.personale').optional().isBoolean().toBoolean(),
  body('permessi.amministrazione.utif').optional().isBoolean().toBoolean(),
  body('permessi.amministrazione.materiale').optional().isBoolean().toBoolean(),
  body('permessi.amministrazione.mezzi').optional().isBoolean().toBoolean(),
  body('permessi.amministrazione.impostazioni').optional().isBoolean().toBoolean(),
  body('personaleId').optional().isInt().toInt()
];

// Return current authenticated user (sans password)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const usersCol = getUsersCol(req);
    const username = req.user?.username;
    if (!username) return res.status(400).json({ message: 'Username mancante nel token' });
    const user = await usersCol.findOne({ username }, { projection: { _id: 0, password: 0 } });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ message: 'Errore server' });
  }
});


const createUserValidationRules = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters if provided'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('role').isIn(['admin', 'volontario']).withMessage('Role must be admin or volontario')
];


function generateRandomPassword(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    const idx = crypto.randomInt(0, chars.length);
    out += chars[idx];
  }
  return out;
}


router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const users = await getUsersCol(req).find({}, { projection: { _id: 0 } }).toArray();
    const sanitized = users.map(({ password, ...u }) => u);
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});


router.post(
  '/invite',
  authMiddleware,
  roleMiddleware(['admin']),
  [
    body('nome').isLength({ min: 1 }).withMessage('Nome richiesto'),
    body('cognome').isLength({ min: 1 }).withMessage('Cognome richiesto'),
    body('email').isEmail().withMessage('Email non valida'),
    body('role').isIn(['admin', 'volontario']).withMessage('Ruolo non valido'),
    // opzionali aggiuntivi
    body('cellulare').optional().isString().trim(),
    body('qualifiche').optional().isArray(),
    body('qualifiche.*').optional().isIn(['autista','soccorritore','infermiere','medico','ufficio']).withMessage('Qualifica non valida'),
    body('stato.volontario').optional().isBoolean().toBoolean(),
    body('stato.attivo').optional().isBoolean().toBoolean(),
    body('permessi.soccorsi').optional().isObject(),
    body('permessi.soccorsi.inserire').optional().isBoolean().toBoolean(),
    body('permessi.soccorsi.elenco').optional().isBoolean().toBoolean(),
    body('permessi.soccorsi.ricerca').optional().isBoolean().toBoolean(),
    body('permessi.soccorsi.report').optional().isBoolean().toBoolean(),
    body('permessi.fogliMarcia').optional().isObject(),
    body('permessi.fogliMarcia.inserire').optional().isBoolean().toBoolean(),
    body('permessi.fogliMarcia.elenco').optional().isBoolean().toBoolean(),
    body('permessi.fogliMarcia.ricerca').optional().isBoolean().toBoolean(),
    body('permessi.fogliMarcia.modifica').optional().isBoolean().toBoolean(),
    body('permessi.fogliMarcia.altro').optional().isBoolean().toBoolean(),
    body('permessi.fogliMarcia.tutto').optional().isBoolean().toBoolean(),
    body('permessi.consegne').optional().isObject(),
    body('permessi.consegne.aggiungi').optional().isBoolean().toBoolean(),
    body('permessi.checklist').optional().isObject(),
    body('permessi.checklist.nuova').optional().isBoolean().toBoolean(),
    body('permessi.checklist.mia').optional().isBoolean().toBoolean(),
    body('permessi.checklist.archivio').optional().isBoolean().toBoolean(),
    body('permessi.checklistAutisti').optional().isObject(),
    body('permessi.checklistAutisti.nuova').optional().isBoolean().toBoolean(),
    body('permessi.checklistAutisti.segnalazioni').optional().isBoolean().toBoolean(),
    body('permessi.checklistAutisti.mia').optional().isBoolean().toBoolean(),
    body('permessi.ferie').optional().isObject(),
    body('permessi.ferie.nuovaRichiesta').optional().isBoolean().toBoolean(),
    body('permessi.amministrazione').optional().isObject(),
    body('permessi.amministrazione.utenti').optional().isBoolean().toBoolean(),
    body('permessi.amministrazione.personale').optional().isBoolean().toBoolean(),
    body('permessi.amministrazione.utif').optional().isBoolean().toBoolean(),
    body('permessi.amministrazione.materiale').optional().isBoolean().toBoolean(),
    body('permessi.amministrazione.mezzi').optional().isBoolean().toBoolean(),
    body('permessi.amministrazione.impostazioni').optional().isBoolean().toBoolean(),
    body('personaleId').optional().isInt().toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, cognome, email, role } = req.body;
    const cellulare = typeof req.body.cellulare === 'string' ? req.body.cellulare.trim() : undefined;
    const qualifiche = Array.isArray(req.body.qualifiche) ? req.body.qualifiche : [];
    const stato = {
      volontario: req.body?.stato?.volontario === true,
      attivo: req.body?.stato?.attivo !== false // default true
    };
    const ps = req.body?.permessi?.soccorsi || {};
    const pm = req.body?.permessi?.fogliMarcia || {};
    const pc = req.body?.permessi?.consegne || {};
    const pcl = req.body?.permessi?.checklist || {};
    const pcla = req.body?.permessi?.checklistAutisti || {};
    const pf = req.body?.permessi?.ferie || {};
    const pa = req.body?.permessi?.amministrazione || {};
    const permessi = {
      soccorsi: {
        inserire: ps.inserire === true,
        elenco: ps.elenco === true,
        ricerca: ps.ricerca === true,
        report: ps.report === true
      },
      fogliMarcia: {
        inserire: pm.inserire === true,
        elenco: pm.elenco === true,
        ricerca: pm.ricerca === true,
        modifica: pm.modifica === true,
        altro: pm.altro === true,
        tutto: pm.tutto === true
      },
      consegne: {
        aggiungi: pc.aggiungi === true
      },
      checklist: {
        nuova: pcl.nuova === true,
        mia: pcl.mia === true,
        archivio: pcl.archivio === true
      },
      checklistAutisti: {
        nuova: pcla.nuova === true,
        segnalazioni: pcla.segnalazioni === true,
        mia: pcla.mia === true
      },
      ferie: {
        nuovaRichiesta: pf.nuovaRichiesta === true
      },
      amministrazione: {
        utenti: pa.utenti === true,
        personale: pa.personale === true,
        utif: pa.utif === true,
        materiale: pa.materiale === true,
        mezzi: pa.mezzi === true,
        impostazioni: pa.impostazioni === true
      }
    };
    const usersCol = getUsersCol(req);


    const normalize = (s) =>
      String(s || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '');

    const n = normalize(nome);
    const c = normalize(cognome);
    let baseUsername = n && c ? `${n.charAt(0)}.${c}` : (c || n || 'user');
    baseUsername = baseUsername.replace(/\.+/g, '.');


    let username = baseUsername;
    let suffix = 1;
    while (await usersCol.findOne({ username })) {
      suffix += 1;
      username = `${baseUsername}${suffix}`;
    }


    const plainPassword = generateRandomPassword(8);

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const last = await usersCol.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
    const nextId = last.length ? (Number(last[0].id) || 0) + 1 : 1;

    const newUser = {
      id: nextId,
      username,
      password: hashedPassword,
      email,
      role,
      nome,
      cognome,
      cellulare: cellulare || '',
      qualifiche,
      stato,
      permessi,
      personaleId: Number.isInteger(req.body?.personaleId) ? req.body.personaleId : null,
      suspended: false
    };
    await usersCol.insertOne(newUser);

    // credenziali email
    try {
      await sendMail({
        to: email,
        subject: 'Credenziali di accesso',
        text: `Benvenuto/a!\n\nUsername: ${username}\nPassword temporanea: ${plainPassword}\n\nAccedi qui: ${APP_PUBLIC_URL ? (APP_PUBLIC_URL.replace(/\/$/, '') + '/login') : ''}\n\nSe il tuo telefono lo consente, puoi installare l'app dalla pagina di login (link diretto installazione: ${APP_PUBLIC_URL ? (APP_PUBLIC_URL.replace(/\/$/, '') + '/login?install=1') : ''}).\n\nTi invitiamo a effettuare il primo accesso e cambiare la password.`,
        html: `<p>Benvenuto/a!</p>
               <p><b>Username:</b> ${username}<br/>
               <b>Password temporanea:</b> ${plainPassword}</p>
               <p><a href="${APP_PUBLIC_URL ? (APP_PUBLIC_URL.replace(/\/$/, '') + '/login') : '#'}" target="_blank" rel="noopener">Accedi all'Area Riservata</a></p>
               <p><a href="${APP_PUBLIC_URL ? (APP_PUBLIC_URL.replace(/\/$/, '') + '/login?install=1') : '#'}" target="_blank" rel="noopener">Installa l'app sul tuo telefono</a> (se supportato).</p>
               <p>Ti invitiamo a effettuare il primo accesso e cambiare la password.</p>`,
        replyTo: process.env.EMAIL_REPLY_TO || undefined,
        bcc: (process.env.EMAIL_BCC || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      });
    } catch (e) {
      console.warn('Email invio fallito:', e?.message);
    }

    const { password, ...userWithoutPassword } = newUser;
    return res.status(201).json({ message: 'Utente creato e notificato', user: userWithoutPassword });
  }
);


router.get('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUsersCol(req).findOne({ id }, { projection: { _id: 0 } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});


router.post('/', authMiddleware, roleMiddleware(['admin']), createUserValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email, role } = req.body;

  try {
    const usersCol = getUsersCol(req);
    const existing = await usersCol.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const plainPassword = password && String(password).trim().length >= 6 ? String(password) : generateRandomPassword(8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const last = await usersCol.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
    const nextId = last.length ? last[0].id + 1 : 1;

    const newUser = { id: nextId, username, password: hashedPassword, email, role, suspended: false };
    await usersCol.insertOne(newUser);


    try {
      await sendMail({
        to: email,
        subject: 'Credenziali di accesso',
        text: `Benvenuto/a!\n\nUsername: ${username}\nPassword temporanea: ${plainPassword}\n\nAccedi qui: ${APP_PUBLIC_URL ? (APP_PUBLIC_URL.replace(/\/$/, '') + '/login') : ''}\n\nSe il tuo telefono lo consente, puoi installare l'app dalla pagina di login (link diretto installazione: ${APP_PUBLIC_URL ? (APP_PUBLIC_URL.replace(/\/$/, '') + '/login?install=1') : ''}).\n\nTi invitiamo a effettuare il primo accesso e cambiare la password.`,
        html: `<p>Benvenuto/a!</p>
               <p><b>Username:</b> ${username}<br/>
               <b>Password temporanea:</b> ${plainPassword}</p>
               <p><a href="${APP_PUBLIC_URL ? (APP_PUBLIC_URL.replace(/\/$/, '') + '/login') : '#'}" target="_blank" rel="noopener">Accedi all'Area Riservata</a></p>
               <p><a href="${APP_PUBLIC_URL ? (APP_PUBLIC_URL.replace(/\/$/, '') + '/login?install=1') : '#'}" target="_blank" rel="noopener">Installa l'app sul tuo telefono</a> (se supportato).</p>
               <p>Ti invitiamo a effettuare il primo accesso e cambiare la password.</p>`,
        replyTo: process.env.EMAIL_REPLY_TO || undefined,
        bcc: (process.env.EMAIL_BCC || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      });
    } catch (e) {
      console.warn('Email invio fallito:', e?.message);
    }

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Utente creato e notificato', user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['admin']), userValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id);
    const usersCol = getUsersCol(req);
    const existing = await usersCol.findOne({ id });
    if (!existing) return res.status(404).json({ message: 'User not found' });

    const { username, password, email, role } = req.body;
    if (username !== existing.username) {
      const usernameTaken = await usersCol.findOne({ username, id: { $ne: id } });
      if (usernameTaken) return res.status(400).json({ message: 'Username already exists' });
    }

    const cellulare = typeof req.body.cellulare === 'string' ? req.body.cellulare.trim() : existing.cellulare;
    const qualifiche = Array.isArray(req.body.qualifiche) ? req.body.qualifiche : existing.qualifiche || [];
    const stato = {
      volontario: req.body?.stato?.volontario ?? existing?.stato?.volontario ?? false,
      attivo: req.body?.stato?.attivo ?? existing?.stato?.attivo ?? true
    };
    const psu = req.body?.permessi?.soccorsi || {};
    const pmu = req.body?.permessi?.fogliMarcia || {};
    const pcu = req.body?.permessi?.consegne || {};
    const pclu = req.body?.permessi?.checklist || {};
    const pcla_u = req.body?.permessi?.checklistAutisti || {};
    const pfu = req.body?.permessi?.ferie || {};
    const pau = req.body?.permessi?.amministrazione || {};
    const permessi = {
      soccorsi: {
        inserire: psu.inserire ?? existing?.permessi?.soccorsi?.inserire ?? false,
        elenco: psu.elenco ?? existing?.permessi?.soccorsi?.elenco ?? false,
        ricerca: psu.ricerca ?? existing?.permessi?.soccorsi?.ricerca ?? false,
        report: psu.report ?? existing?.permessi?.soccorsi?.report ?? false
      },
      fogliMarcia: {
        inserire: pmu.inserire ?? existing?.permessi?.fogliMarcia?.inserire ?? false,
        elenco: pmu.elenco ?? existing?.permessi?.fogliMarcia?.elenco ?? false,
        ricerca: pmu.ricerca ?? existing?.permessi?.fogliMarcia?.ricerca ?? false,
        modifica: pmu.modifica ?? existing?.permessi?.fogliMarcia?.modifica ?? false,
        altro: pmu.altro ?? existing?.permessi?.fogliMarcia?.altro ?? false,
        tutto: pmu.tutto ?? existing?.permessi?.fogliMarcia?.tutto ?? false
      },
      consegne: {
        aggiungi: pcu.aggiungi ?? existing?.permessi?.consegne?.aggiungi ?? false
      },
      checklist: {
        nuova: pclu.nuova ?? existing?.permessi?.checklist?.nuova ?? false,
        mia: pclu.mia ?? existing?.permessi?.checklist?.mia ?? false,
        archivio: pclu.archivio ?? existing?.permessi?.checklist?.archivio ?? false
      },
      checklistAutisti: {
        nuova: pcla_u.nuova ?? existing?.permessi?.checklistAutisti?.nuova ?? false,
        segnalazioni: pcla_u.segnalazioni ?? existing?.permessi?.checklistAutisti?.segnalazioni ?? false,
        mia: pcla_u.mia ?? existing?.permessi?.checklistAutisti?.mia ?? false
      },
      ferie: {
        nuovaRichiesta: pfu.nuovaRichiesta ?? existing?.permessi?.ferie?.nuovaRichiesta ?? false
      },
      amministrazione: {
        utenti: pau.utenti ?? existing?.permessi?.amministrazione?.utenti ?? false,
        personale: pau.personale ?? existing?.permessi?.amministrazione?.personale ?? false,
        utif: pau.utif ?? existing?.permessi?.amministrazione?.utif ?? false,
        materiale: pau.materiale ?? existing?.permessi?.amministrazione?.materiale ?? false,
        mezzi: pau.mezzi ?? existing?.permessi?.amministrazione?.mezzi ?? false,
        impostazioni: pau.impostazioni ?? existing?.permessi?.amministrazione?.impostazioni ?? false
      }
    };

    const updateDoc = { username, email, role, cellulare, qualifiche, stato, permessi };
    if (password) {
      updateDoc.password = await bcrypt.hash(password, 10);
    }

    await usersCol.updateOne({ id }, { $set: updateDoc });
    const updated = await usersCol.findOne({ id }, { projection: { _id: 0, password: 0 } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});


router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getUsersCol(req).deleteOne({ id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});


router.patch('/:id/suspend', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usersCol = getUsersCol(req);
    const existing = await usersCol.findOne({ id });
    if (!existing) return res.status(404).json({ message: 'User not found' });
    await usersCol.updateOne({ id }, { $set: { suspended: true } });
    const updated = await usersCol.findOne({ id }, { projection: { _id: 0, password: 0 } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to suspend user' });
  }
});


router.patch('/:id/activate', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usersCol = getUsersCol(req);
    const existing = await usersCol.findOne({ id });
    if (!existing) return res.status(404).json({ message: 'User not found' });
    await usersCol.updateOne({ id }, { $set: { suspended: false } });
    const updated = await usersCol.findOne({ id }, { projection: { _id: 0, password: 0 } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to activate user' });
  }
});

module.exports = router;
