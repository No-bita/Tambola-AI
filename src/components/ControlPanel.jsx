import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, AlertTriangle, Eye, Download, Printer } from 'lucide-react';
import { DEFAULT_THEMES } from '../utils/tambolaEngine';

const TRANSLATIONS = {
  en: {
    configTitle: 'Configurator',
    configSub: 'Configure theme rules, item names and ticket layout.',
    customTitleLabel: 'Ticket Custom Title / Banner',
    themeLabel: 'Theme Template',
    languageLabel: 'Display Language',
    ticketStyleLabel: 'Ticket Skin/Design',
    ticketsCountLabel: 'Tickets Count',
    rowsCountLabel: 'Rows Count',
    columnsCountLabel: 'Columns Count',
    itemListHeader: 'Theme Item List',
    addItemManual: '✍️ Add Manually',
    addItemBulk: '📋 Bulk Import List',
    resetButton: 'Reset',
    searchPlaceholder: '🔍 Search items...',
    generateButton: '✨ Generate Tambola Tickets',
    needsItemsWarning: (count) => `You need at least ${count} items in the list to generate tickets.`,
    themeFood: '🍕 Food Fiesta',
    themeKitty: '💄 Kitty Party',
    themeCustom: '✨ Create Custom',
    skinRoyalGold: '👑 Royal Gold',
    skinNeonParty: '⚡ Neon Party',
    skinFreshMint: '🍃 Fresh Mint',
    skinClassicRetro: '📜 Classic Retro',
    itemsStatus: (count, needed) => `${count} Items (${count >= needed ? 'Valid' : `Needs ${needed}`})`,
    importBtn: (count) => `Import ${count} Items`,
    bulkPlaceholder: 'Paste items separated by commas or lines, e.g.:\nDosa 🥞, Jalebi 🥨, Samosa, Dhokla',
    labelEmoji: 'Emoji',
    labelNameEn: 'Name (English)',
    labelNameHi: 'Hindi (optional)',
    labelNameGu: 'Gujarati (optional)',
    noItemsMatch: 'No items matched search.',
    addWarningSuffix: (needed, current) => ` Add ${needed - current} more!`
  },
  hi: {
    configTitle: 'कॉन्फ़िगरेशन',
    configSub: 'थीम नियम, आइटम नाम और टिकट लेआउट सेट करें।',
    customTitleLabel: 'टिकट कस्टम शीर्षक / बैनर',
    themeLabel: 'थीम टेम्पलेट',
    languageLabel: 'प्रदर्शन भाषा',
    ticketStyleLabel: 'टिकट डिज़ाइन/त्वचा',
    ticketsCountLabel: 'टिकटों की संख्या',
    rowsCountLabel: 'पंक्तियों की संख्या',
    columnsCountLabel: 'कॉलम की संख्या',
    itemListHeader: 'थीम आइटम सूची',
    addItemManual: '✍️ मैन्युअल जोड़ें',
    addItemBulk: '📋 थोक आयात सूची',
    resetButton: 'रीसेट',
    searchPlaceholder: '🔍 आइटम खोजें...',
    generateButton: '✨ तंबोला टिकट जनरेट करें',
    needsItemsWarning: (count) => `टिकट बनाने के लिए आपको सूची में कम से कम ${count} आइटम चाहिए।`,
    themeFood: '🍕 फ़ूड फ़िएस्टा',
    themeKitty: '💄 किटी पार्टी',
    themeCustom: '✨ कस्टम बनाएं',
    skinRoyalGold: '👑 रॉयल गोल्ड',
    skinNeonParty: '⚡ नियॉन पार्टी',
    skinFreshMint: '🍃 फ्रेश मिंट',
    skinClassicRetro: '📜 क्लासिक रेट्रो',
    itemsStatus: (count, needed) => `${count} आइटम (${count >= needed ? 'वैध' : `आवश्यकता ${needed}`})`,
    importBtn: (count) => `${count} आइटम आयात करें`,
    bulkPlaceholder: 'अल्पविराम या नई लाइनों द्वारा अलग किए गए आइटम पेस्ट करें, जैसे:\nडोसा 🥞, जलेबी 🥨, समोसा, ढोकला',
    labelEmoji: 'इमोजी',
    labelNameEn: 'नाम (अंग्रेजी)',
    labelNameHi: 'हिंदी (वैकल्पिक)',
    labelNameGu: 'गुजराती (वैकल्पिक)',
    noItemsMatch: 'कोई आइटम खोज से मेल नहीं खाता।',
    addWarningSuffix: (needed, current) => ` और ${needed - current} जोड़ें!`
  },
  gu: {
    configTitle: 'રૂપરેખાંકન',
    configSub: 'થીમ નિયમો, વસ્તુના નામ અને ટિકિટ લેઆઉટ સેટ કરો.',
    customTitleLabel: 'ટિકિટ કસ્ટમ શીર્ષક / બેનર',
    themeLabel: 'થીમ નમૂનો',
    languageLabel: 'પ્રદર્શન ભાષા',
    ticketStyleLabel: 'ટિકિટ ડિઝાઇન/સ્કિન',
    ticketsCountLabel: 'ટિકિટોની સંખ્યા',
    rowsCountLabel: 'પંક્તિઓની સંખ્યા',
    columnsCountLabel: 'કૉલમની સંખ્યા',
    itemListHeader: 'થીમ વસ્તુ સૂચિ',
    addItemManual: '✍️ મેન્યુઅલી ઉમેરો',
    addItemBulk: '📋 બલ્ક આયાત સૂચિ',
    resetButton: 'રીસેટ',
    searchPlaceholder: '🔍 વસ્તુઓ શોધો...',
    generateButton: '✨ તંબોલા ટિકિટ બનાવો',
    needsItemsWarning: (count) => `ટિકિટ બનાવવા માટે તમારે સૂચિમાં ઓછામાં ઓછી ${count} વસ્તુઓની જરૂર છે.`,
    themeFood: '🍕 ફૂડ ફિએસ્ટા',
    themeKitty: '💄 કીટી પાર્ટી',
    themeCustom: '✨ કસ્ટમ બનાવો',
    skinRoyalGold: '👑 રોયલ ગોલ્ડ',
    skinNeonParty: '⚡ નિયોન પાર્ટી',
    skinFreshMint: '🍃 ફ્રેશ મિન્ટ',
    skinClassicRetro: '📜 ક્લાસિક રેટ્રો',
    itemsStatus: (count, needed) => `${count} વસ્તુઓ (${count >= needed ? 'માન્ય' : `જરૂર છે ${needed}`})`,
    importBtn: (count) => `${count} વસ્તુઓ આયાત કરો`,
    bulkPlaceholder: 'અલ્પવિરામ અથવા પંક્તિઓ દ્વારા અલગ કરેલી વસ્તુઓ પેસ્ટ કરો, જેમ કે:\nઢોસા 🥞, જલેબી 🥨, સમોસા, ઢોકળા',
    labelEmoji: 'ઇમોજી',
    labelNameEn: 'નામ (અંગ્રેજી)',
    labelNameHi: 'હિન્દી (વૈકલ્પિક)',
    labelNameGu: 'ગુજરાતી (વૈકલ્પિક)',
    noItemsMatch: 'કોઈ વસ્તુ શોધ સાથે મેળ ખાતી નથી.',
    addWarningSuffix: (needed, current) => ` વધુ ${needed - current} ઉમેરો!`
  }
};

export default function ControlPanel({
  language,
  setLanguage,
  theme,
  setTheme,
  items,
  setItems,
  ticketsCount,
  setTicketsCount,
  ticketStyle,
  setTicketStyle,
  onGenerate,
  customTitle,
  setCustomTitle,
  rows,
  setRows,
  columns,
  setColumns
}) {
  const [newEmoji, setNewEmoji] = useState('🍿');
  const [newEnName, setNewEnName] = useState('');
  const [newHiName, setNewHiName] = useState('');
  const [newGuName, setNewGuName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const neededItemsCount = rows * columns;
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Handle bulk pasting of items
  const handleBulkImport = () => {
    if (!bulkInput.trim()) return;

    const lines = bulkInput.split(/[,\n]/);
    const newItemsList = [];
    
    // Comprehensive emoji matching regex
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}]/u;

    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      const emojiMatch = cleanLine.match(emojiRegex);
      const emoji = emojiMatch ? emojiMatch[0] : '🍿';
      
      let nameStr = cleanLine.replace(emojiRegex, '').trim();
      nameStr = nameStr.replace(/^[-\s]+|[-\s]+$/g, ''); // strip leading/trailing hyphens or space

      if (!nameStr) return;

      newItemsList.push({
        id: `custom-bulk-${Date.now()}-${Math.random()}`,
        emoji,
        name: {
          en: nameStr,
          hi: nameStr,
          gu: nameStr
        }
      });
    });

    if (newItemsList.length > 0) {
      setItems([...newItemsList, ...items]);
      setBulkInput('');
      setShowBulk(false);
    }
  };

  // Handle adding a new item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newEnName.trim()) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      emoji: newEmoji,
      name: {
        en: newEnName.trim(),
        hi: newHiName.trim() || newEnName.trim(),
        gu: newGuName.trim() || newEnName.trim()
      }
    };

    setItems([newItem, ...items]);
    setNewEnName('');
    setNewHiName('');
    setNewGuName('');
  };

  // Reset theme items to original state
  const handleResetItems = () => {
    if (DEFAULT_THEMES[theme]) {
      setItems([...DEFAULT_THEMES[theme].items]);
    } else {
      setItems([]);
    }
  };

  // Remove an item
  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Filter items based on search query
  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.en.toLowerCase().includes(q) ||
      (item.name.hi && item.name.hi.toLowerCase().includes(q)) ||
      (item.name.gu && item.name.gu.toLowerCase().includes(q))
    );
  });

  return (
    <div className="glass-panel no-print" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px', background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t.configTitle}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {t.configSub}
        </p>
      </div>

      {/* Title settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
          {t.customTitleLabel}
        </label>
        <input
          type="text"
          value={customTitle.en || ''}
          onChange={(e) => setCustomTitle({ ...customTitle, en: e.target.value })}
          className="form-input"
          placeholder={`${t.labelNameEn || 'English'} (e.g. rasoda)`}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input
            type="text"
            value={customTitle.hi || ''}
            onChange={(e) => setCustomTitle({ ...customTitle, hi: e.target.value })}
            placeholder={t.labelNameHi || 'Hindi (optional)'}
            className="form-input"
            style={{ fontSize: '12px' }}
          />
          <input
            type="text"
            value={customTitle.gu || ''}
            onChange={(e) => setCustomTitle({ ...customTitle, gu: e.target.value })}
            placeholder={t.labelNameGu || 'Gujarati (optional)'}
            className="form-input"
            style={{ fontSize: '12px' }}
          />
        </div>
      </div>

      {/* Grid: Theme + Language */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.themeLabel}</label>
          <select
            value={theme}
            onChange={(e) => {
              const val = e.target.value;
              setTheme(val);
              if (DEFAULT_THEMES[val]) {
                setItems([...DEFAULT_THEMES[val].items]);
              } else {
                setItems([]);
              }
              setCustomTitle({ en: '', hi: '', gu: '' }); // Reset override to fallback to translated title
            }}
            className="form-input"
          >
            <option value="food">{t.themeFood}</option>
            <option value="kitty">{t.themeKitty}</option>
            <option value="custom">{t.themeCustom}</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.languageLabel}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-input"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="gu">Gujarati (ગુજરાતી)</option>
          </select>
        </div>
      </div>

      {/* Grid Size Config: Rows + Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.rowsCountLabel}</label>
          <input
            type="number"
            min="1"
            max="6"
            value={rows}
            onChange={(e) => setRows(Math.min(6, Math.max(1, parseInt(e.target.value) || 1)))}
            className="form-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.columnsCountLabel}</label>
          <input
            type="number"
            min="1"
            max="9"
            value={columns}
            onChange={(e) => setColumns(Math.min(9, Math.max(1, parseInt(e.target.value) || 1)))}
            className="form-input"
          />
        </div>
      </div>

      {/* Grid: Ticket Style + Count */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.ticketStyleLabel}</label>
          <select
            value={ticketStyle}
            onChange={(e) => setTicketStyle(e.target.value)}
            className="form-input"
          >
            <option value="royal-gold">{t.skinRoyalGold}</option>
            <option value="neon-party">{t.skinNeonParty}</option>
            <option value="fresh-mint">{t.skinFreshMint}</option>
            <option value="classic-retro">{t.skinClassicRetro}</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{t.ticketsCountLabel}</label>
          <input
            type="number"
            min="1"
            max="120"
            value={ticketsCount}
            onChange={(e) => setTicketsCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="form-input"
          />
        </div>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

      {/* Items Section Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {t.itemListHeader}
            <span style={{
              marginLeft: '8px',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '20px',
              backgroundColor: items.length >= neededItemsCount ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: items.length >= neededItemsCount ? '#10b981' : '#ef4444'
            }}>
              {t.itemsStatus(items.length, neededItemsCount)}
            </span>
          </h3>
          {theme !== 'custom' && (
            <button
              onClick={handleResetItems}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}
              title="Reset items list"
            >
              <RotateCcw size={12} /> {t.resetButton}
            </button>
          )}
        </div>

        {items.length < neededItemsCount && (
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontSize: '12px',
            marginBottom: '12px'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{t.needsItemsWarning(neededItemsCount)}{t.addWarningSuffix(neededItemsCount, items.length)}</span>
          </div>
        )}

        {/* Toggle between manual add and bulk import */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setShowBulk(false)}
            className={`btn ${!showBulk ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, padding: '6px 12px', fontSize: '12px' }}
          >
            {t.addItemManual}
          </button>
          <button
            type="button"
            onClick={() => setShowBulk(true)}
            className={`btn ${showBulk ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, padding: '6px 12px', fontSize: '12px' }}
          >
            {t.addItemBulk}
          </button>
        </div>

        {showBulk ? (
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder={t.bulkPlaceholder}
              className="form-input"
              rows="3"
              style={{ resize: 'vertical', fontSize: '13px', fontFamily: 'inherit' }}
            />
            <button
              type="button"
              onClick={handleBulkImport}
              className="btn btn-primary"
              style={{ padding: '8px 12px', fontSize: '13px', width: '100%' }}
              disabled={!bulkInput.trim()}
            >
              {t.importBtn(bulkInput.split(/[,\n]/).filter(item => item.trim()).length || '')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddItem} className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                placeholder={t.labelEmoji}
                style={{ width: '50px', textAlign: 'center' }}
                className="form-input"
              />
              <input
                type="text"
                value={newEnName}
                onChange={(e) => setNewEnName(e.target.value)}
                placeholder={t.labelNameEn}
                className="form-input"
              />
              <button
                type="submit"
                disabled={!newEnName.trim()}
                className="btn btn-primary"
                style={{ padding: '0 12px', flexShrink: 0 }}
              >
                <Plus size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input
                type="text"
                value={newHiName}
                onChange={(e) => setNewHiName(e.target.value)}
                placeholder={t.labelNameHi}
                className="form-input"
                style={{ fontSize: '12px' }}
              />
              <input
                type="text"
                value={newGuName}
                onChange={(e) => setNewGuName(e.target.value)}
                placeholder={t.labelNameGu}
                className="form-input"
                style={{ fontSize: '12px' }}
              />
            </div>
          </form>
        )}

        {/* Search bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="form-input"
          style={{ marginBottom: '8px', padding: '6px 12px', fontSize: '13px' }}
        />

        {/* Scrollable list of items */}
        <div style={{
          maxHeight: '220px',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '6px',
          paddingRight: '4px'
        }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{item.name.en}</span>
                  {(item.name.hi !== item.name.en || item.name.gu !== item.name.en) && (
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      {item.name.hi} / {item.name.gu}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              {t.noItemsMatch}
            </div>
          )}
        </div>
      </div>

      {/* Main Generate Button */}
      <button
        onClick={onGenerate}
        disabled={items.length < neededItemsCount}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '14px 20px',
          fontSize: '16px',
          fontWeight: '700',
          marginTop: '10px',
          opacity: items.length < neededItemsCount ? 0.5 : 1,
          cursor: items.length < neededItemsCount ? 'not-allowed' : 'pointer'
        }}
      >
        {t.generateButton}
      </button>
    </div>
  );
}
