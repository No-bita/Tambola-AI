import React, { useRef, useState } from 'react';
import { DEFAULT_THEMES } from '../utils/tambolaEngine';

const TRANSLATIONS = {
  en: {
    previewHeader: 'Live Sheets Preview',
    previewSub: (ticketsCount, pagesCount) => `Showing ${ticketsCount} tickets spread across ${pagesCount} A4 page(s)`,
    btnPrint: 'Print',
    btnExport: 'Export PDF (A4)',
    renderingPdf: (progress) => `Rendering PDF (${progress}%)`,
    cardNo: (no) => `Card #${no}`,
    cutMark: 'Cut',
    defaultTitle: 'TAMBOLA AI'
  },
  hi: {
    previewHeader: 'लाइव शीट पूर्वावलोकन',
    previewSub: (ticketsCount, pagesCount) => `${ticketsCount} टिकटों को ${pagesCount} A4 पेज(पेजों) में दिखाया जा रहा है`,
    btnPrint: 'प्रिंट',
    btnExport: 'पीडीएफ निर्यात करें (A4)',
    renderingPdf: (progress) => `पीडीएफ रेंडर किया जा रहा है (${progress}%)`,
    cardNo: (no) => `कार्ड #${no}`,
    cutMark: 'कट',
    defaultTitle: 'तंबोला AI'
  },
  gu: {
    previewHeader: 'લાઇવ શીટ્સ પૂર્વાવલોકન',
    previewSub: (ticketsCount, pagesCount) => `${ticketsCount} ટિકિટો ${pagesCount} A4 પૃષ્ઠ(ઓ) પર દર્શાવવામાં આવી રહી છે`,
    btnPrint: 'પ્રિન્ટ',
    btnExport: 'પીડીએફ નિકાસ કરો (A4)',
    renderingPdf: (progress) => `પીડીએફ રેન્ડર કરી રહ્યું છે (${progress}%)`,
    cardNo: (no) => `કાર્ડ #${no}`,
    cutMark: 'કટ',
    defaultTitle: 'તંબોલા AI'
  }
};

export default function TicketGrid({
  tickets,
  language,
  theme,
  ticketStyle,
  customTitle,
  customBgImage,
  setTickets,
  ticketsPerPage,
  rows,
  columns,
  fontSizeScale
}) {
  const perPage = ticketsPerPage || 2;
  const [markedCells, setMarkedCells] = useState({}); // { [ticketId-row-col]: boolean }
  const containerRef = useRef(null);
  
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isDeckTheme = ticketStyle === 'deck-design';

  // Compute current header title dynamically supporting translation fallbacks
  const currentTitle = 
    (customTitle[language] && customTitle[language].trim()) || 
    (customTitle['en'] && customTitle['en'].trim()) || 
    (DEFAULT_THEMES[theme]?.name[language] || t.defaultTitle);

  // Get current font family based on selected language
  const getFontFamily = () => {
    if (isDeckTheme) return "'Cinzel', Georgia, serif";
    if (language === 'gu') return 'var(--font-gujarati)';
    if (language === 'hi') return 'var(--font-devanagari)';
    return 'var(--font-sans)';
  };

  // Parse card rank & suit from card item
  const parseCardItem = (item) => {
    if (!item) return null;
    const rawEn = typeof item === 'object' && item.name?.en ? item.name.en : (typeof item === 'string' ? item : (item.name || ''));
    const id = item.id || '';

    const match = rawEn.match(/^([AKQJ0-9]+)\s*([♠♥♦♣])/i);
    if (match) {
      const rank = match[1].toUpperCase();
      const suit = match[2];
      const isRed = suit === '♥' || suit === '♦';
      return { rank, suit, isRed, isCard: true };
    }

    if (id.startsWith('c_')) {
      const suitLetter = id.slice(-1).toLowerCase();
      const rankStr = id.slice(2, -1).toUpperCase();
      const suitMap = { s: '♠', h: '♥', d: '♦', c: '♣' };
      const suit = suitMap[suitLetter] || '♠';
      const isRed = suitLetter === 'h' || suitLetter === 'd';
      return { rank: rankStr, suit, isRed, isCard: true };
    }

    return null;
  };

  // Get item name depending on language selection
  const getItemName = (item) => {
    if (!item) return '';
    return typeof item === 'object' ? (item.name?.[language] || item.name?.['en'] || item.name || '') : item;
  };

  // Get custom uploaded design styles or custom image background styles
  const getCustomStyles = () => {
    if (ticketStyle === 'custom-image-bg' && customBgImage) {
      return {
        wrapper: {
          background: `url(${customBgImage}) center/cover no-repeat`,
          border: '2px solid rgba(0,0,0,0.15)',
          color: '#1e1a34',
          fontFamily: getFontFamily(),
          boxShadow: 'inset 0 0 0 1000px rgba(255, 255, 255, 0.2)'
        },
        header: {
          borderBottom: '2px solid rgba(30, 26, 52, 0.15)',
          color: '#1e1a34'
        },
        cell: (isMarked, isEmpty) => ({
          background: isEmpty ? 'transparent' : (isMarked ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.75)'),
          border: '1px solid rgba(30, 26, 52, 0.12)',
          color: isMarked ? '#ffffff' : '#1e1a34',
          backdropFilter: isEmpty ? 'none' : 'blur(2px)'
        })
      };
    }
    return null;
  };

  const customStyles = getCustomStyles();

  // Toggle cell marked status (gameplay simulation)
  const toggleCell = (ticketId, rowIndex, colIndex) => {
    const key = `${ticketId}-${rowIndex}-${colIndex}`;
    setMarkedCells(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Divide tickets into pages based on density setting
  const getPages = () => {
    const pages = [];
    for (let i = 0; i < tickets.length; i += perPage) {
      pages.push(tickets.slice(i, i + perPage));
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <div
        className="print-area"
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
          overflowX: 'hidden',
          padding: '10px 0',
          '--ticket-font-scale': fontSizeScale || '1'
        }}
      >
        {pages.map((pageTickets, pageIdx) => (
          <div
            key={pageIdx}
            className={`a4-page a4-grid-${perPage}`}
          >
            {pageTickets.map((ticket, ticketIdx) => {
              const globalIndex = pageIdx * perPage + ticketIdx;
              return (
                <div
                  key={ticket.id}
                  id={`ticket-element-${ticket.id}`}
                  className={`ticket-wrapper theme-${ticketStyle}`}
                  style={customStyles ? customStyles.wrapper : { fontFamily: getFontFamily() }}
                >
                  {/* House of Cards Custom Header */}
                  {isDeckTheme ? (
                    <div className="deck-header">
                      {/* Left Badge: T. No */}
                      <div className="deck-badge-tno">
                        <div className="deck-badge-inner">
                          <span className="deck-badge-label">T. NO</span>
                          <span className="deck-badge-num">{globalIndex + 1}</span>
                        </div>
                      </div>

                      {/* Center Title with Crown */}
                      <div className="deck-title-group">
                        <div className="deck-crown-flourish">
                          <div className="deck-flourish-line"></div>
                          <span className="deck-crown-icon">👑</span>
                          <div className="deck-flourish-line"></div>
                        </div>
                        <h2 className="deck-main-title">{currentTitle}</h2>
                        <div className="deck-title-underline"></div>
                      </div>

                      {/* Right Badge: DEALER */}
                      <div className="deck-badge-dealer">
                        <div className="deck-badge-dealer-inner">
                          <span className="deck-dealer-label">DEALER</span>
                          <span className="deck-dealer-sub">✦</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Standard Ticket Header Banner */
                    <div className="ticket-header" style={customStyles ? customStyles.header : {}}>
                      <span className="ticket-title">{currentTitle}</span>
                      <span className="ticket-no">{t.cardNo(globalIndex + 1)}</span>
                    </div>
                  )}

                  {/* Grid Container (with side banners for House of Cards) */}
                  <div className={isDeckTheme ? "deck-grid-container" : ""}>
                    {isDeckTheme && (
                      <div className="deck-side-banner left">
                        <span className="deck-laurel-icon">🌿</span>
                        <span>PLAY</span>
                        <span>YOUR</span>
                        <span>CARDS</span>
                      </div>
                    )}

                    {/* Custom Ticket Grid */}
                    <div className="ticket-grid" style={{
                      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${rows}, 1fr)`
                    }}>
                      {ticket.grid.map((row, rIdx) => 
                        row.map((item, cIdx) => {
                          const cellKey = `${ticket.id}-${rIdx}-${cIdx}`;
                          const isMarked = !!markedCells[cellKey];
                          const isEmpty = !item;
                          const cardData = !isEmpty ? parseCardItem(item) : null;

                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              onClick={() => !isEmpty && toggleCell(ticket.id, rIdx, cIdx)}
                              className={`ticket-cell ${isEmpty ? 'empty' : 'filled'} ${isMarked ? 'marked' : ''} ${isDeckTheme ? 'deck-card-cell' : ''} ${isDeckTheme ? (cardData?.isRed ? 'suit-red' : 'suit-black') : ''}`}
                              style={customStyles ? customStyles.cell(isMarked, isEmpty) : {}}
                            >
                              {!isEmpty && isDeckTheme && cardData?.isCard ? (
                                <div className="deck-card-content">
                                  <div className="deck-card-corner top-left">
                                    <span className="deck-corner-rank">{cardData.rank}</span>
                                    <span className="deck-corner-suit">{cardData.suit}</span>
                                  </div>
                                  <div className="deck-card-center">
                                    <span className="deck-center-suit">{cardData.suit}</span>
                                  </div>
                                </div>
                              ) : !isEmpty ? (
                                <span className={`cell-name ${isDeckTheme && cardData?.isRed ? 'suit-red' : ''}`}>
                                  {getItemName(item)}
                                </span>
                              ) : null}

                              {!isEmpty && isMarked && (
                                <div style={{
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  pointerEvents: 'none',
                                  borderRadius: 'inherit'
                                }}>
                                  <div style={{
                                    border: '2px solid #ef4444',
                                    borderRadius: '50%',
                                    width: '26px',
                                    height: '26px',
                                    transform: 'rotate(-12deg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ef4444',
                                    fontSize: '8px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase'
                                  }}>
                                    {t.cutMark}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {isDeckTheme && (
                      <div className="deck-side-banner right">
                        <span className="deck-laurel-icon">🌿</span>
                        <span>LUCK</span>
                        <span>FAVORS</span>
                        <span>YOU</span>
                      </div>
                    )}
                  </div>

                  {/* House of Cards Bottom Banner */}
                  {isDeckTheme && (
                    <div className="deck-bottom-banner">
                      <div className="deck-banner-border">
                        <span className="deck-banner-flourish">✦</span>
                        <span className="deck-banner-text">PLACE YOUR BETS, MARK YOUR LUCK!</span>
                        <span className="deck-banner-flourish">✦</span>
                      </div>
                    </div>
                  )}

                  {/* Ticket Footer */}
                  <div className={`ticket-footer ${isDeckTheme ? 'deck-footer' : ''}`}>
                    Made with <span className="ticket-footer-heart">❤️</span> by Falguni Shah | 9821881964
                  </div>

                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
