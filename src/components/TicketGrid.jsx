import React, { useRef, useState } from 'react';
import { Download, Printer, Share2, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  setTickets,
  rows,
  columns
}) {
  const ticketsPerPage = 2;
  const [markedCells, setMarkedCells] = useState({}); // { [ticketId-row-col]: boolean }
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const containerRef = useRef(null);
  
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Compute current header title dynamically supporting translation fallbacks
  const currentTitle = 
    (customTitle[language] && customTitle[language].trim()) || 
    (customTitle['en'] && customTitle['en'].trim()) || 
    (DEFAULT_THEMES[theme]?.name[language] || t.defaultTitle);

  // Get current font family based on selected language
  const getFontFamily = () => {
    if (language === 'gu') return 'var(--font-gujarati)';
    if (language === 'hi') return 'var(--font-devanagari)';
    return 'var(--font-sans)';
  };

  // Get item name depending on language selection
  const getItemName = (item) => {
    if (!item) return '';
    return item.name[language] || item.name['en'] || item.name;
  };

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
    for (let i = 0; i < tickets.length; i += ticketsPerPage) {
      pages.push(tickets.slice(i, i + ticketsPerPage));
    }
    return pages;
  };



  // Trigger Browser Print Dialogue
  const handlePrint = () => {
    window.print();
  };

  // Export full pages PDF
  const exportPDF = async () => {
    const pages = document.querySelectorAll('.a4-page');
    if (!pages.length) return;

    try {
      setIsExporting(true);
      setExportProgress(10);
      
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      for (let i = 0; i < pages.length; i++) {
        setExportProgress(Math.round(10 + (i / pages.length) * 80));
        const canvas = await html2canvas(pages[i], {
          scale: 2, // good resolution vs file size trade-off
          useCORS: true,
          logging: false
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        if (i > 0) {
          doc.addPage();
        }
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      setExportProgress(95);
      doc.save(`${currentTitle.replace(/\s+/g, '_')}_Tickets.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const pages = getPages();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      {/* Top Floating Action Bar */}
      <div className="glass-panel no-print" style={{
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{t.previewHeader}</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {t.previewSub(tickets.length, pages.length)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePrint}
            className="btn btn-secondary"
          >
            <Printer size={18} /> {t.btnPrint}
          </button>
          
          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="btn btn-primary"
          >
            {isExporting ? (
              <span>{t.renderingPdf(exportProgress)}</span>
            ) : (
              <>
                <Download size={18} /> {t.btnExport}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid styling based on tickets density */}
      <div className="print-area" ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
        {pages.map((pageTickets, pageIdx) => (
          <div
            key={pageIdx}
            className={`a4-page a4-grid-${ticketsPerPage}`}
          >
            {pageTickets.map((ticket, ticketIdx) => {
              const globalIndex = pageIdx * ticketsPerPage + ticketIdx;
              return (
                <div
                  key={ticket.id}
                  id={`ticket-element-${ticket.id}`}
                  className={`ticket-wrapper theme-${ticketStyle}`}
                  style={{ fontFamily: getFontFamily() }}
                >


                  {/* Ticket Header Banner */}
                  <div className="ticket-header">
                    <span className="ticket-title">{currentTitle}</span>
                    <span className="ticket-no">{t.cardNo(globalIndex + 1)}</span>
                  </div>

                  {/* Custom Ticket Grid */}
                  <div className="ticket-grid" style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`
                  }}>
                    {ticket.grid.map((row, rIdx) => 
                      row.map((item, cIdx) => {
                        const cellKey = `${ticket.id}-${rIdx}-${cIdx}`;
                        const isMarked = !!markedCells[cellKey];

                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            onClick={() => toggleCell(ticket.id, rIdx, cIdx)}
                            className={`ticket-cell filled ${isMarked ? 'marked' : ''}`}
                          >
                            {/* <span className="cell-emoji">{item.emoji}</span> */}
                            <span className="cell-name">{getItemName(item)}</span>
                            {isMarked && (
                              <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                background: 'rgba(239, 68, 68, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none'
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



                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
