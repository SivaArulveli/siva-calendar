import { useState, useEffect, useCallback } from 'react';
import { DayCard, DayCardsData } from '../lib/types';

export function useDayCards() {
  const [dayCards, setDayCards] = useState<DayCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from static JSON + LocalStorage override
  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await fetch('/data/day_cards.json');
        let data: DayCardsData = { dayCards: [] };
        if (response.ok) {
          data = await response.json();
        }
        
        // Merge with local storage if any exist
        const localData = localStorage.getItem('local_day_cards');
        if (localData) {
          const parsedLocal: DayCardsData = JSON.parse(localData);
          // Local storage takes precedence
          const merged = [...data.dayCards];
          for (const localCard of parsedLocal.dayCards) {
            const idx = merged.findIndex(c => c.id === localCard.id);
            if (idx >= 0) {
              merged[idx] = localCard;
            } else {
              merged.push(localCard);
            }
          }
          setDayCards(merged);
        } else {
          setDayCards(data.dayCards);
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

  const exportData = useCallback(() => {
    const data: DayCardsData = { dayCards };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'day_cards.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [dayCards]);

  return { dayCards, loading, saveCard, deleteCard, getDayCard, exportData };
}
