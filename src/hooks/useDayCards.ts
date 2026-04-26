import { useState, useEffect, useCallback } from 'react';
import { DayCard, DayCardsData, MonthExport } from '../lib/types';

// Migration function to convert old simple cards to new complex schema if needed
function migrateOldCard(card: any): DayCard {
  if (card.tamil_date) return card as DayCard; // already new format

  return {
    id: card.id,
    tamil_date: {
      label_ta: `${card.tamil_month || ''} ${card.tamil_day || ''}`.trim(),
      label_en: '',
      day_ta: String(card.tamil_day || ''),
      day_en: '',
    },
    gregorian_date: {
      iso: card.id,
      display_en: card.date || card.id,
    },
    weekday: { ta: '', en: '' },
    visual: {
      placeholder_image_url: card.imageUrl || '',
      placeholder_alt_text: 'Migrated day card',
      theme_tag: 'regular'
    },
    cycles: {
      lunar_phase_icon: 'new_moon',
      solar_cycle_icon: 'uttarayana'
    },
    events: (card.events || []).map((e: any) => ({
      title_ta: e.name,
      title_en: e.name,
      description_ta: '',
      description_en: '',
      importance_level: 'medium',
      icon: 'calendar'
    }))
  };
}

export function useDayCards() {
  const [dayCards, setDayCards] = useState<DayCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from static JSON + LocalStorage override
  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await fetch('/data/day_cards.json');
        let data: any = { dayCards: [] };
        if (response.ok) {
          data = await response.json();
        }
        
        let loadedCards: DayCard[] = [];
        // Handle both old DayCardsData format and new MonthExport arrays if present
        if (data.dayCards) {
          loadedCards = data.dayCards.map(migrateOldCard);
        } else if (data.days) {
          loadedCards = data.days.map(migrateOldCard);
        }
        
        // Merge with local storage if any exist
        const localData = localStorage.getItem('local_day_cards');
        if (localData) {
          const parsedLocal = JSON.parse(localData);
          let localCards = parsedLocal.dayCards || parsedLocal.days || [];
          localCards = localCards.map(migrateOldCard);

          const merged = [...loadedCards];
          for (const localCard of localCards) {
            const idx = merged.findIndex(c => c.id === localCard.id);
            if (idx >= 0) {
              merged[idx] = localCard;
            } else {
              merged.push(localCard);
            }
          }
          setDayCards(merged);
        } else {
          setDayCards(loadedCards);
        }
      } catch (error) {
        console.error("Failed to load day cards:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCards();
  }, []);

  const saveCard = useCallback((card: DayCard) => {
    setDayCards(prev => {
      const idx = prev.findIndex(c => c.id === card.id);
      const next = [...prev];
      if (idx >= 0) {
        next[idx] = card;
      } else {
        next.push(card);
      }
      localStorage.setItem('local_day_cards', JSON.stringify({ dayCards: next }));
      return next;
    });
  }, []);

  const deleteCard = useCallback((id: string) => {
    setDayCards(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem('local_day_cards', JSON.stringify({ dayCards: next }));
      return next;
    });
  }, []);

  const getDayCard = useCallback((id: string) => {
    return dayCards.find(c => c.id === id);
  }, [dayCards]);

  const exportMonth = useCallback((monthExport: MonthExport) => {
    const blob = new Blob([JSON.stringify(monthExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siva_panchangam_${monthExport.gregorian_range.start}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      let importedCards: DayCard[] = [];
      if (data.days && Array.isArray(data.days)) {
        // MonthExport format
        importedCards = data.days.map(migrateOldCard);
      } else if (data.dayCards && Array.isArray(data.dayCards)) {
        // Old DayCardsData format
        importedCards = data.dayCards.map(migrateOldCard);
      } else {
        return false;
      }
      
      setDayCards(prev => {
        const next = [...prev];
        for (const card of importedCards) {
          const idx = next.findIndex(c => c.id === card.id);
          if (idx >= 0) {
            next[idx] = card;
          } else {
            next.push(card);
          }
        }
        // Save to local storage after cleaning up potential duplicates
        const uniqueCards = Array.from(new Map(next.map(c => [c.id, c])).values());
        localStorage.setItem('local_day_cards', JSON.stringify({ dayCards: uniqueCards }));
        return uniqueCards;
      });
      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
    }
    return false;
  }, []);

  return { dayCards, loading, saveCard, deleteCard, getDayCard, exportMonth, importData };
}
