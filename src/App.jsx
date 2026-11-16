import React, { useState } from 'react';
import { motion } from 'framer-motion';
import settingsData from './content/settings.json';
import appsData from './content/apps.json';

const AfrinodeLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="animate-float">
    <svg width="50" height="50" viewBox="0 0 100 100">
      <circle cx="20" cy="30" r="4" fill="#D4AF37" className="animate-node" />
      <circle cx="40" cy="15" r="4" fill="#D4AF37" className="animate-node" style={{ animationDelay: '0.5s' }} />
      <circle cx="30" cy="50" r="4" fill="#D4AF37" className="animate-node" style={{ animationDelay: '1s' }} />
      <path d="M20 30 L40 15 L50 40" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="100" strokeDashoffset="100" style={{ animation: 'drawLine 2s ease-out forwards' }} />
      <path d="M20 30 L30 50 L60 50" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="100" strokeDashoffset="100" style={{ animation: 'drawLine 2s ease-out 0.5s forwards' }} />
      <path d="M50 40 L70 90 L50 90 Z" fill="#0A192F" stroke="#D4AF37" strokeWidth="2" />
      <path d="M70 90 L90 90 L60 20 Z" fill="#D4AF37" opacity="0.8" />
    </svg>
    <div>
      <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px' }}><span style={{ color: 'white' }}>AFRI</span><span style={{ color: '#D4AF37' }}>NODE</span></h1>
      <p style={{ margin: 0, fontSize: '10px', color: '#00A86B', letterSpacing: '2px', fontWeight: 'bold' }}>CONNECT. INTELLIGENT. TRANSFORM AFRICA.</p>
    </div>
  </div>
);

export default function App() {
  const [settings] = useState(settingsData);
  const [apps] = useState(appsData.apps);
  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px', backgroundColor: 'rgba(10, 25, 47, 0.95)', position: 'fixed', width: '100%', top: 0, boxSizing: 'border-box', zIndex: 100, borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <AfrinodeLogo />
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a href="#tech" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Our Tech</a>
          <a href="/admin/" style={{ color: '#0A192F', background: '#D4AF37', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>Admin Login</a>
        </div>
      </nav>
      <header style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ fontSize: '4rem', marginBottom: '20px', fontWeight: '900', lineHeight: '1.2' }}>
          {settings.title.split('AFRINODE')[0]}<span style={{ color: '#D4AF37' }}>AFRINODE</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} style={{ fontSize: '1.2rem', color: '#a0aab8', maxWidth: '700px', marginBottom: '40px' }}>
          {settings.subtitle}
        </motion.p>
        <motion.a href="#tech" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '15px 40px', background: '#D4AF37', color: '#0A192F', textDecoration: 'none', fontWeight: 'bold', borderRadius: '50px', fontSize: '1.1rem', boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' }}>Explore Our Tech</motion.a>
      </header>
      <section id="tech" style={{ padding: '100px 50px', backgroundColor: '#060e1a', minHeight: '100vh' }}>
        <h2 style={{ textAlign: 'center', color: '#D4AF37', fontSize: '2.5rem', marginBottom: '50px' }}>Our Technologies</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {apps.map((app, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }} className="tech-card">
              {app.image && <img src={app.image} alt={app.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '20px' }} />}
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{app.title}</h3>
              <p style={{ color: '#a0aab8', lineHeight: '1.6' }}>{app.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
