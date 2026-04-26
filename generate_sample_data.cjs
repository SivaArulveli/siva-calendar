const fs = require('fs');
const path = require('path');

const generateData = () => {
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

  const eventsList = [
    {
      title_ta: 'பிரதோஷம்',
      title_en: 'Pradosham',
      description_ta: 'சிவனுக்கு உகந்த நாள்.',
      description_en: 'Auspicious day for Lord Shiva.',
      importance_level: 'high',
      icon: 'sparkles'
    },
    {
      title_ta: 'சங்கடஹர சதுர்த்தி',
      title_en: 'Sankatahara Chaturthi',
      description_ta: 'விநாயகர் வழிபாடு.',
      description_en: 'Worship of Lord Ganesha.',
      importance_level: 'high',
      icon: 'star'
    },
    {
      title_ta: 'அமாவாசை',
      title_en: 'Amavasya',
      description_ta: 'முன்னோர் வழிபாடு.',
      description_en: 'New moon day.',
      importance_level: 'medium',
      icon: 'moon'
    },
    {
      title_ta: 'பௌர்ணமி',
      title_en: 'Pournami',
      description_ta: 'முழு நிலவு நாள்.',
      description_en: 'Full moon day.',
      importance_level: 'high',
      icon: 'sun'
    }
  ];

  const days = [];
  const startDate = new Date(Date.UTC(2026, 3, 14)); // April 14, 2026

  for (let i = 1; i <= 31; i++) {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + i - 1);
    const dateStr = d.toISOString().split('T')[0];
    
    const numEvents = Math.floor(Math.random() * 3);
    const dayEvents = [];
    for (let e = 0; e < numEvents; e++) {
      dayEvents.push(eventsList[Math.floor(Math.random() * eventsList.length)]);
    }

    const img = images[Math.floor(Math.random() * images.length)];
    const moon = Math.random() > 0.5 ? 'pournami' : 'new_moon';
    const sun = Math.random() > 0.5 ? 'uttarayana' : 'dakshinayana';

    days.push({
      id: dateStr,
      tamil_date: {
        label_ta: `சித்திரை ${i}`,
        label_en: `Chithirai ${i}`,
        day_ta: String(i),
        day_en: String(i)
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
        placeholder_alt_text: 'Hindu God',
        theme_tag: 'regular'
      },
      cycles: {
        lunar_phase_icon: moon,
        solar_cycle_icon: sun
      },
      events: dayEvents
    });
  }

  const exportData = {
    panchangam_title: "Siva Vaibhava Panchangam",
    tamil_month: { ta: "சித்திரை", en: "Chithirai" },
    tamil_year: { ta: "பராபவ", en: "Parabhava" },
    gregorian_range: {
      start: "2026-04-14",
      end: "2026-05-14",
      days: 31
    },
    days: days
  };

  fs.writeFileSync(path.join(__dirname, 'public/data/day_cards.json'), JSON.stringify(exportData, null, 2));
  console.log('Sample data generated for Parabhava Chithirai in public/data/day_cards.json');
};

generateData();
