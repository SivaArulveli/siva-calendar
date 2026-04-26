import { useState, useEffect, useCallback } from 'react';
import { MonthConfig, MonthsData } from '@/lib/types';

export function useMonths() {
  const [months, setMonths] = useState<MonthConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await fetch('/data/months.json');
        if (!response.ok) {
          // It's okay if the file doesn't exist yet, we'll start with an empty array
          if (response.status === 404) {
            setMonths([]);
            return;
          }
          throw new Error('Failed to fetch months data');
        }
        const data: MonthsData = await response.json();
        setMonths(data.months || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching months:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonths();
  }, []);

  const saveMonthConfig = useCallback((config: MonthConfig) => {
    setMonths(prev => {
      const existingIdx = prev.findIndex(m => m.id === config.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = config;
        return updated;
      }
      return [...prev, config];
    });
  }, []);

  const getMonthConfig = useCallback((yearIndex: number, monthIndex: number) => {
    const id = `${yearIndex}-${monthIndex}`;
    return months.find(m => m.id === id);
  }, [months]);

  const exportData = useCallback(() => {
    const data: MonthsData = { months };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'months.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [months]);

  return { months, isLoading, error, saveMonthConfig, getMonthConfig, exportData };
}
