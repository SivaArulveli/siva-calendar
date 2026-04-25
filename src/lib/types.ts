export interface DayCard {
  id: string; // typically the gregorian date (YYYY-MM-DD)
  tamil_year_code: string;
  gregorian_date: string;
  tamil_month: string;
  tamil_day_number: number;
  weekday: string;
  title?: string;
  summary?: string;
  notes?: string;
  image_url?: string;
  image_alt?: string;
  tags?: string[];
  is_public?: boolean;
}

export interface DayCardsData {
  dayCards: DayCard[];
}
