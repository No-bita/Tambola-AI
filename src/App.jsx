import React, { useState, useEffect } from 'react';
import { Sparkles, Dices } from 'lucide-react';
import ControlPanel from './components/ControlPanel';
import TicketGrid from './components/TicketGrid';
import { DEFAULT_THEMES, generateTicket } from './utils/tambolaEngine';

const TRANSLATIONS = {
  en: {
    appTitle: 'Tambola',
    appSubtitle: 'Themed Housie Ticket Generator',
    langSupport: 'Gujarati | Hindi | English Supported',
    footer: 'Tambola AI © 2026. Customizable layouts filling fixed grids of arbitrary dimensions.'
  },
  hi: {
    appTitle: 'तंबोला',
    appSubtitle: 'थीम आधारित तंबोला टिकट जनरेटर',
    langSupport: 'गुजराती | हिंदी | अंग्रेजी समर्थित',
    footer: 'तंबोला AI © 2026। मनमाने आयामों के निश्चित ग्रिड को भरने वाले अनुकूलन योग्य लेआउट।'
  },
  gu: {
    appTitle: 'તંબોલા',
    appSubtitle: 'થીમ આધારિત તંબોલા ટિકિટ જનરેટર',
    langSupport: 'ગુજરાતી | હિન્દી | અંગ્રેજી સમર્થિત',
    footer: 'તંબોલા AI © 2026. મનસ્વી પરિમાણોના નિશ્ચિત ગ્રીડને ભરવા માટે વૈવિધ્યપૂર્ણ લેઆઉટ.'
  }
};

export default function App() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('food');
  const [items, setItems] = useState([]);
  const [customTitle, setCustomTitle] = useState({ en: '', hi: '', gu: '' });
  const [ticketsCount, setTicketsCount] = useState(6);
  const [ticketStyle, setTicketStyle] = useState('royal-gold');
  const [tickets, setTickets] = useState([]);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(9);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Load default food theme on mount
  useEffect(() => {
    if (DEFAULT_THEMES.food) {
      setItems([...DEFAULT_THEMES.food.items]);
    }
  }, []);

  // Update page title when language changes
  useEffect(() => {
    document.title = `${t.appTitle} - ${t.appSubtitle}`;
  }, [language, t]);

  // Handle generating new tickets
  const handleGenerate = () => {
    if (items.length < rows * columns) return;
    
    const newTickets = [];
    for (let i = 0; i < ticketsCount; i++) {
      try {
        const ticket = generateTicket(items, i, rows, columns);
        newTickets.push(ticket);
      } catch (err) {
        console.error('Failed to generate ticket:', err);
      }
    }
    setTickets(newTickets);
  };

  // Auto-generate tickets when items, rows, columns, or counts change
  useEffect(() => {
    if (items.length >= rows * columns) {
      handleGenerate();
    }
  }, [items, rows, columns, ticketsCount]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header (hidden on print) */}
      <header className="no-print" style={{
        padding: '20px 40px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(138, 43, 226, 0.3)'
          }}>
            <Dices color="white" size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
              {t.appTitle} <span style={{ color: 'var(--accent-secondary)' }}>AI</span>
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
              {t.appSubtitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <Sparkles size={14} color="var(--accent-secondary)" />
          <span>{t.langSupport}</span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        padding: '30px 40px',
        gap: '30px',
        maxWidth: '1600px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        
        {/* Left Side: Control Panel (no-print) */}
        <div className="no-print" style={{ width: '420px', flexShrink: 0 }}>
          <ControlPanel
            language={language}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
            items={items}
            setItems={setItems}
            ticketsCount={ticketsCount}
            setTicketsCount={setTicketsCount}
            ticketStyle={ticketStyle}
            setTicketStyle={setTicketStyle}
            onGenerate={handleGenerate}
            customTitle={customTitle}
            setCustomTitle={setCustomTitle}
            rows={rows}
            setRows={setRows}
            columns={columns}
            setColumns={setColumns}
          />
        </div>

        {/* Right Side: Printable Tickets area */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {tickets.length > 0 ? (
            <TicketGrid
              tickets={tickets}
              language={language}
              theme={theme}
              ticketStyle={ticketStyle}
              customTitle={customTitle}
              setTickets={setTickets}
              rows={rows}
              columns={columns}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              textAlign: 'center',
              width: '100%'
            }} className="glass-panel">
              <Dices size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>No Tickets Generated</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', marginTop: '4px' }}>
                Add at least {rows * columns} items in the list and click "Generate Tambola Tickets" to view your themed print sheet.
              </p>
            </div>
          )}
        </div>

      </main>

      {/* Footer (no-print) */}
      <footer className="no-print" style={{
        padding: '20px 40px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        fontSize: '12px',
        color: 'var(--text-muted)',
        marginTop: 'auto'
      }}>
        {t.footer}
      </footer>

    </div>
  );
}
