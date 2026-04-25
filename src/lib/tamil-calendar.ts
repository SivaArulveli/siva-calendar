// Tamil calendar data and helpers

export const TAMIL_YEARS_60: { en: string; ta: string }[] = [
  { en: "Prabhava", ta: "பிரபவ" }, { en: "Vibhava", ta: "விபவ" },
  { en: "Sukla", ta: "சுக்ல" }, { en: "Pramoda", ta: "பிரமோதூத" },
  { en: "Prachorpaththi", ta: "பிரசோற்பத்தி" }, { en: "Aangirasa", ta: "ஆங்கீரஸ" },
  { en: "Srimukha", ta: "ஸ்ரீமுக" }, { en: "Bhava", ta: "பவ" },
  { en: "Yuva", ta: "யுவ" }, { en: "Dhaatu", ta: "தாது" },
  { en: "Eswara", ta: "ஈஸ்வர" }, { en: "Bahudhanya", ta: "வெகுதானிய" },
  { en: "Pramathi", ta: "பிரமாதி" }, { en: "Vikrama", ta: "விக்ரம" },
  { en: "Vishu", ta: "விஷு" }, { en: "Chitrabhanu", ta: "சித்திரபானு" },
  { en: "Swabhanu", ta: "சுபானு" }, { en: "Tarana", ta: "தாரண" },
  { en: "Parthiba", ta: "பார்த்திப" }, { en: "Viya", ta: "விய" },
  { en: "Sarvajith", ta: "சர்வசித்து" }, { en: "Sarvadhari", ta: "சர்வதாரி" },
  { en: "Virodhi", ta: "விரோதி" }, { en: "Vikruthi", ta: "விக்ருதி" },
  { en: "Kara", ta: "கர" }, { en: "Nandhana", ta: "நந்தன" },
  { en: "Vijaya", ta: "விஜய" }, { en: "Jaya", ta: "ஜய" },
  { en: "Manmadha", ta: "மன்மத" }, { en: "Dhunmuki", ta: "துன்முகி" },
  { en: "Hevilambi", ta: "ஹேவிளம்பி" }, { en: "Vilambi", ta: "விளம்பி" },
  { en: "Vikari", ta: "விகாரி" }, { en: "Sarvari", ta: "சார்வரி" },
  { en: "Plava", ta: "பிலவ" }, { en: "Subhakrutu", ta: "சுபகிருது" },
  { en: "Sobhakrutu", ta: "சோபகிருது" }, { en: "Krodhi", ta: "குரோதி" },
  { en: "Visvavasu", ta: "விசுவாவசு" }, { en: "Parabhava", ta: "பராபவ" },
  { en: "Plavanga", ta: "பிலவங்க" }, { en: "Kilaka", ta: "கீலக" },
  { en: "Saumya", ta: "சௌமிய" }, { en: "Sadharana", ta: "சாதாரண" },
  { en: "Virodhikrutu", ta: "விரோதகிருது" }, { en: "Paridhapi", ta: "பரிதாபி" },
  { en: "Pramadhisa", ta: "பிரமாதீச" }, { en: "Aananda", ta: "ஆனந்த" },
  { en: "Rakshasa", ta: "ராட்சச" }, { en: "Nala", ta: "நள" },
  { en: "Pingala", ta: "பிங்கள" }, { en: "Kalayukti", ta: "காளயுக்தி" },
  { en: "Siddharthi", ta: "சித்தார்த்தி" }, { en: "Raudri", ta: "ரௌத்திரி" },
  { en: "Durmathi", ta: "துர்மதி" }, { en: "Dundubhi", ta: "துந்துபி" },
  { en: "Rudhrodhgaari", ta: "ருத்ரோத்காரி" }, { en: "Raktakshi", ta: "ரக்தாட்சி" },
  { en: "Krodhana", ta: "குரோதன" }, { en: "Akshaya", ta: "அட்சய" },
];

export const TAMIL_MONTHS: { en: string; ta: string; gregStart: string; days: number }[] = [
  { en: "Chithirai", ta: "சித்திரை", gregStart: "Apr 14", days: 31 },
  { en: "Vaikasi",   ta: "வைகாசி",   gregStart: "May 15", days: 31 },
  { en: "Aani",      ta: "ஆனி",      gregStart: "Jun 15", days: 32 },
  { en: "Aadi",      ta: "ஆடி",      gregStart: "Jul 17", days: 31 },
  { en: "Aavani",    ta: "ஆவணி",    gregStart: "Aug 17", days: 31 },
  { en: "Purattasi", ta: "புரட்டாசி", gregStart: "Sep 17", days: 31 },
  { en: "Aippasi",   ta: "ஐப்பசி",   gregStart: "Oct 18", days: 30 },
  { en: "Karthigai", ta: "கார்த்திகை", gregStart: "Nov 17", days: 30 },
  { en: "Margazhi",  ta: "மார்கழி",  gregStart: "Dec 16", days: 29 },
  { en: "Thai",      ta: "தை",       gregStart: "Jan 14", days: 29 },
  { en: "Maasi",     ta: "மாசி",     gregStart: "Feb 13", days: 30 },
  { en: "Panguni",   ta: "பங்குனி",  gregStart: "Mar 14", days: 31 },
];

// Sunday=0, Monday=1, ... Saturday=6
export const TAMIL_WEEKDAYS: { ta: string; en: string }[] = [
  { ta: "ஞாயிறு", en: "Sun" },
  { ta: "திங்கள்", en: "Mon" },
  { ta: "செவ்வாய்", en: "Tue" },
  { ta: "புதன்", en: "Wed" },
  { ta: "வியாழன்", en: "Thu" },
  { ta: "வெள்ளி", en: "Fri" },
  { ta: "சனி", en: "Sat" },
];

// Cycle anchor: Prabhava (index 0) corresponds to Gregorian year 1987-1988.
// So Tamil year index N → Gregorian start year = 1987 + N (mod 60), repeating.
const CYCLE_ANCHOR_YEAR = 1987;

export function tamilYearToGregorian(yearIndex: number, cycleOffset = 0): number {
  // cycleOffset lets us shift to a different 60-year cycle window
  return CYCLE_ANCHOR_YEAR + yearIndex + cycleOffset * 60;
}

/** Get the Gregorian Date for the 1st of a Tamil month given a Tamil year index. */
export function getTamilMonthStartDate(yearIndex: number, monthIndex: number, cycleOffset = 0): Date {
  const startGregYear = tamilYearToGregorian(yearIndex, cycleOffset);
  const m = TAMIL_MONTHS[monthIndex];
  const [monStr, dayStr] = m.gregStart.split(" ");
  const monthMap: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  // Months Jan, Feb, Mar fall in the next Gregorian year of the Tamil year cycle
  const gMonth = monthMap[monStr];
  const yearForMonth = gMonth <= 2 ? startGregYear + 1 : startGregYear;
  return new Date(yearForMonth, gMonth, parseInt(dayStr, 10));
}

/** Returns 0..6 (Sun..Sat) representing the weekday of the 1st of the chosen Tamil month. */
export function getStartWeekday(yearIndex: number, monthIndex: number, cycleOffset = 0): number {
  return getTamilMonthStartDate(yearIndex, monthIndex, cycleOffset).getDay();
}

/** Tamil numerals for fun display */
export const TAMIL_DIGITS = ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"];
export function toTamilNumber(n: number): string {
  return String(n).split("").map((d) => TAMIL_DIGITS[parseInt(d, 10)] ?? d).join("");
}
