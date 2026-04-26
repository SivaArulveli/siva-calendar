export interface PanchangamEvent {
  title_ta: string;
  title_en: string;
  description_ta?: string;
  description_en?: string;
  importance_level?: string;
  icon?: string;
}

export interface DayCard {
  id: string; // typically the gregorian date (YYYY-MM-DD)
  tamil_date: {
    label_ta: string;
    label_en: string;
    day_ta: string;
    day_en: string;
  };
  gregorian_date: {
    iso: string;
    display_en: string;
  };
  weekday: {
    ta: string;
    en: string;
  };
  visual: {
    placeholder_image_url: string;
    placeholder_alt_text: string;
    theme_tag: string;
  };
  cycles: {
    lunar_phase_icon: string;
    solar_cycle_icon: string;
  };
  events: PanchangamEvent[];
}

export interface MonthExport {
  panchangam_title: string;
  tamil_month: {
    ta: string;
    en: string;
  };
  tamil_year: {
    ta: string;
    en: string;
  };
  gregorian_range: {
    start: string;
    end: string;
    days: number;
  };
  days: DayCard[];
}

export interface DayCardsData {
  dayCards: DayCard[];
}

export interface MonthConfig {
  id: string; // Format: "YEARINDEX-MONTHINDEX" e.g., "37-0" for Krodhi-Chithirai
  tamil_year_index: number;
  tamil_month_index: number;
  start_weekday_offset: number; // 0-6 (Sun-Sat) override
  admin_note?: string;
}

export interface MonthsData {
  months: MonthConfig[];
}
