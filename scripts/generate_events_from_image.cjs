const fs = require('fs');
const path = require('path');

const eventList = [
  { date: "2026-01-20", ayanam: "uttarayana", taMonth: "Thai", taDay: 6, natchathiram: "Thiruoosnam", desc: "" },
  { date: "2026-02-16", ayanam: "uttarayana", taMonth: "Maasi", taDay: 4, natchathiram: "Thiruoosnam", desc: "" },
  { date: "2026-03-15", ayanam: "uttarayana", taMonth: "Panguni", taDay: 1, natchathiram: "Thiruoosnam", desc: "" },
  { date: "2026-05-09", ayanam: "uttarayana", taMonth: "Chithirai", taDay: 26, natchathiram: "Thiruoosnam", desc: "" },
  { date: "2026-05-28", ayanam: "uttarayana", taMonth: "Vaikasi", taDay: 14, natchathiram: "Chithirai", desc: "100th jenma dinam" },
  { date: "2026-06-05", ayanam: "uttarayana", taMonth: "Vaikasi", taDay: 22, natchathiram: "Thiruoosnam", desc: "" },
  { date: "2026-06-22", ayanam: "uttarayana", taMonth: "Aani", taDay: 8, natchathiram: "", desc: "Aani Thirumanjanam" },
  { date: "2026-07-03", ayanam: "uttarayana", taMonth: "Aani", taDay: 19, natchathiram: "Thiruoosnam", desc: "" },
  { date: "2026-07-17", ayanam: "dakshinayana", taMonth: "Aadi", taDay: 1, natchathiram: "", desc: "Vaasi Yogam" },
  { date: "2026-07-21", ayanam: "dakshinayana", taMonth: "Aadi", taDay: 5, natchathiram: "Chithirai", desc: "" },
  { date: "2026-07-28", ayanam: "dakshinayana", taMonth: "Aadi", taDay: 12, natchathiram: "", desc: "Aadi Tapas" },
  { date: "2026-07-29", ayanam: "dakshinayana", taMonth: "Aadi", taDay: 13, natchathiram: "Pournami", desc: "Gurupoornima" },
  { date: "2026-08-18", ayanam: "dakshinayana", taMonth: "Aavani", taDay: 1, natchathiram: "Chithirai", desc: "" },
  { date: "2026-10-11", ayanam: "dakshinayana", taMonth: "Purattasi", taDay: 24, natchathiram: "Chithirai", desc: "" },
  { date: "2026-11-08", ayanam: "dakshinayana", taMonth: "Aippasi", taDay: 22, natchathiram: "Chithirai", desc: "Deewali" },
  { date: "2026-12-05", ayanam: "dakshinayana", taMonth: "Karthigai", taDay: 19, natchathiram: "Chithirai", desc: "" },
  { date: "2026-12-24", ayanam: "dakshinayana", taMonth: "Margazhi", taDay: 9, natchathiram: "Thiruvadhirai", desc: "Margazhi Thiruvaathirai" },
  { date: "2027-01-01", ayanam: "dakshinayana", taMonth: "Margazhi", taDay: 17, natchathiram: "Chithirai", desc: "" },
  { date: "2027-02-06", ayanam: "uttarayana", taMonth: "Thai", taDay: 23, natchathiram: "Thiruoosnam", desc: "Thai Ammavasya & Thiruoosnam & Gurupooja" },
  { date: "2027-03-05", ayanam: "uttarayana", taMonth: "Maasi", taDay: 21, natchathiram: "Thiruoosnam", desc: "" },
  { date: "2027-03-06", ayanam: "uttarayana", taMonth: "Maasi", taDay: 22, natchathiram: "", desc: "Maha Shivarathri" },
  { date: "2027-04-02", ayanam: "uttarayana", taMonth: "Panguni", taDay: 19, natchathiram: "Thiruoosnam", desc: "" }
];

const images = [
  '/images/Kumbabhishegam-1.webp',
  '/images/Siva-1.webp',
  '/images/Siva-Hut1.webp',
  '/images/Siva-hut2.webp',
  '/images/Siva-Parivarajagam.webp',
  '/images/Siva.webp',
  '/images/Siva80-book.webp',
  '/images/Siva80th.webp',
  '/images/SivaParivarajagam.webp',
  '/images/SivaSitting.webp',
  '/images/Siva_Old1.webp',
  '/images/Siva_old2.webp'
];

const tamilDays = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
const englishDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const generateSpecificCards = () => {
  const dayCards = [];

  for (const item of eventList) {
    const d = new Date(item.date + "T00:00:00Z");
    const dateStr = item.date;

    const events = [];
    
    // Natchathiram Event
    if (item.natchathiram) {
      events.push({
        title_ta: item.natchathiram,
        title_en: item.natchathiram,
        description_ta: item.desc || '',
        description_en: item.desc || '',
        importance_level: 'high',
        icon: 'star'
      });
    } else if (item.desc) {
      // Just a description event
      events.push({
        title_ta: item.desc,
        title_en: item.desc,
        description_ta: '',
        description_en: '',
        importance_level: 'high',
        icon: 'sparkles'
      });
    }

    const img = images[Math.floor(Math.random() * images.length)];
    let moon = 'new_moon';
    if (item.natchathiram.toLowerCase() === 'pournami' || item.desc.toLowerCase().includes('pournami')) {
      moon = 'pournami';
    }

    dayCards.push({
      id: dateStr,
      tamil_date: {
        label_ta: `${item.taMonth} ${item.taDay}`,
        label_en: `${item.taMonth} ${item.taDay}`,
        day_ta: String(item.taDay),
        day_en: String(item.taDay)
      },
      gregorian_date: {
        iso: dateStr,
        display_en: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
      },
      weekday: {
        ta: tamilDays[d.getUTCDay()],
        en: englishDays[d.getUTCDay()]
      },
      visual: {
        placeholder_image_url: img,
        placeholder_alt_text: 'Event Photo',
        theme_tag: 'regular'
      },
      cycles: {
        lunar_phase_icon: moon,
        solar_cycle_icon: item.ayanam
      },
      events: events
    });
  }

  // Generate a MonthExport wrapper just to hold them in the new schema
  // (We'll just label it as Parabhava even though it spans multiple years, the app imports all cards anyway)
  const exportData = {
    panchangam_title: "Siva Vaibhava Panchangam Events",
    tamil_month: { ta: "பல மாதங்கள்", en: "Multiple" },
    tamil_year: { ta: "பராபவ", en: "Parabhava" },
    gregorian_range: {
      start: "2026-01-20",
      end: "2027-04-02",
      days: 365
    },
    days: dayCards
  };

  fs.writeFileSync(path.join(__dirname, 'public/data/day_cards.json'), JSON.stringify(exportData, null, 2));
  console.log('Specific events generated in public/data/day_cards.json');
};

generateSpecificCards();
