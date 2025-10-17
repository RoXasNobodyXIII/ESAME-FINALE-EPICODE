import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="footer" className="custom-footer mt-5">
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <h4 className="footer-title">Contatti</h4>
                        <div className="footer-contact">
                            <p className="footer-text">
                                <i className="bi bi-geo-alt-fill"></i>
                                <strong>Indirizzo:</strong>
                                <a href="https://maps.app.goo.gl/gTqLr23TqAAKiPnA7" target="_blank" rel="noopener noreferrer" className="ms-2" aria-label="Vedi su Google Maps">
                                    <i className="bi bi-map"></i>
                                </a>
                                <br />
                                Via Roma, 60<br />
                                Sperlonga, Italy
                            </p>
                            <p className="footer-text">
                                <i className="bi bi-telephone-fill"></i>
                                <strong>Telefono:</strong><br />
                                <a href="tel:+393663283199">366 328 3199</a>
                            </p>
                            <p className="footer-text">
                                <i className="bi bi-envelope-fill"></i>
                                <strong>Email:</strong><br />
                                <a href="mailto:crocedorosudpontino@virgilio.it">crocedorosudpontino@virgilio.it</a>
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <h4 className="footer-title">Orari</h4>
                        <p className="footer-text">
                            <strong>Disponibili 24/7</strong><br />
                            Per emergenze e assistenza
                        </p>
                        <h5 className="footer-social-title mt-4">I nostri social</h5>
                        <div className="footer-social">
                            <a href="https://www.facebook.com/crocedorosudpontino" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Facebook">
                                <i className="bi bi-facebook" aria-hidden="true"></i>
                            </a>
                            <a href="https://www.instagram.com/crocedorosudpontino/" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="Instagram">
                                <i className="bi bi-instagram" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <h4 className="footer-title">Link utili</h4>
                        <ul className="list-unstyled footer-text">
                            <li className="mb-2">
                                <Link to="/chi-siamo">Chi siamo</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/login">Area Riservata</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container-fluid text-center py-3">
                    <p className="mb-0">&copy; {new Date().getFullYear()} Croce d'Oro Sud Pontino ONLUS. Tutti i diritti riservati.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
