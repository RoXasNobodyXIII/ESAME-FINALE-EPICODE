const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 100000, 
  max: 100, 
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    error: 'Too many login attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter }; 


