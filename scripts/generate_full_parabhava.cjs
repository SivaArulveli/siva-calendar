const fs = require("fs");
const path = require("path");

const eventList = [
  {
    date: "2026-01-20",
    ayanam: "uttarayana",
    taMonth: "Thai",
    taDay: 6,
    natchathiram: "Thiruoosnam",
    desc: "",
  },
  {
    date: "2026-02-16",
    ayanam: "uttarayana",
    taMonth: "Maasi",
    taDay: 4,
    natchathiram: "Thiruoosnam",
    desc: "",
  },
  {
    date: "2026-03-15",
    ayanam: "uttarayana",
    taMonth: "Panguni",
    taDay: 1,
    natchathiram: "Thiruoosnam",
    desc: "",
  },
  {
    date: "2026-05-09",
    ayanam: "uttarayana",
    taMonth: "Chithirai",
    taDay: 26,
    natchathiram: "Thiruoosnam",
    desc: "",
  },
  {
    date: "2026-05-28",
    ayanam: "uttarayana",
    taMonth: "Vaikasi",
    taDay: 14,
    natchathiram: "Chithirai",
    desc: "100th jenma dinam",
  },
  {
    date: "2026-06-05",
    ayanam: "uttarayana",
    taMonth: "Vaikasi",
    taDay: 22,
    natchathiram: "Thiruoosnam",
    desc: "",
  },
  {
    date: "2026-06-22",
    ayanam: "uttarayana",
    taMonth: "Aani",
    taDay: 8,
    natchathiram: "",
    desc: "Aani Thirumanjanam",
  },
  {
    date: "2026-07-03",
    ayanam: "uttarayana",
    taMonth: "Aani",
    taDay: 19,
    natchathiram: "Thiruoosnam",
    desc: "",
  },
  {
    date: "2026-07-17",
    ayanam: "dakshinayana",
    taMonth: "Aadi",
    taDay: 1,
    natchathiram: "",
    desc: "Vaasi Yogam",
  },
  {
    date: "2026-07-21",
    ayanam: "dakshinayana",
    taMonth: "Aadi",
    taDay: 5,
    natchathiram: "Chithirai",
    desc: "",
  },
  {
    date: "2026-07-28",
    ayanam: "dakshinayana",
    taMonth: "Aadi",
    taDay: 12,
    natchathiram: "",
    desc: "Aadi Tapas",
  },
  {
    date: "2026-07-29",
    ayanam: "dakshinayana",
    taMonth: "Aadi",
    taDay: 13,
    natchathiram: "Pournami",
    desc: "Gurupoornima",
  },
  {
    date: "2026-08-18",
    ayanam: "dakshinayana",
    taMonth: "Aavani",
    taDay: 1,
    natchathiram: "Chithirai",
    desc: "",
  },
  {
    date: "2026-10-11",
    ayanam: "dakshinayana",
    taMonth: "Purattasi",
    taDay: 24,
    natchathiram: "Chithirai",
    desc: "",
  },
  {
    date: "2026-11-08",
    ayanam: "dakshinayana",
    taMonth: "Aippasi",
    taDay: 22,
    natchathiram: "Chithirai",
    desc: "Deewali",
  },
  {
    date: "2026-12-05",
    ayanam: "dakshinayana",
    taMonth: "Karthigai",
    taDay: 19,
    natchathiram: "Chithirai",
    desc: "",
  },
  {
    date: "2026-12-24",
    ayanam: "dakshinayana",
    taMonth: "Margazhi",
    taDay: 9,
    natchathiram: "Thiruvadhirai",
    desc: "Margazhi Thiruvaathirai",
  },
  {
    date: "2027-01-01",
    ayanam: "dakshinayana",
    taMonth: "Margazhi",
    taDay: 17,
    natchathiram: "Chithirai",
    desc: "",
  },
  {
    date: "2027-02-06",
    ayanam: "uttarayana",
    taMonth: "Thai",
    taDay: 23,
    natchathiram: "Thiruoosnam",
    desc: "Thai Ammavasya & Thiruoosnam & Gurupooja",
  },
  {
    date: "2027-03-05",
    ayanam: "uttarayana",
    taMonth: "Maasi",
    taDay: 21,
    natchathiram: "Thiruoosnam",
    desc: "",
  },
  {
    date: "2027-03-06",
    ayanam: "uttarayana",
    taMonth: "Maasi",
    taDay: 22,
    natchathiram: "",
    desc: "Maha Shivarathri",
  },
  {
    date: "2027-04-02",
    ayanam: "uttarayana",
    taMonth: "Panguni",
    taDay: 19,
    natchathiram: "Thiruoosnam",
    desc: "",
  },
];

const eventMap = {};
for (const e of eventList) {
  eventMap[e.date] = e;
}

const images = [
  "/images/Kumbabhishegam-1.webp",
  "/images/Siva-1.webp",
  "/images/Siva-Hut1.webp",
  "/images/Siva-hut2.webp",
  "/images/Siva-Parivarajagam.webp",
  "/images/Siva.webp",
  "/images/Siva80-book.webp",
  "/images/Siva80th.webp",
  "/images/SivaParivarajagam.webp",
  "/images/SivaSitting.webp",
  "/images/Siva_Old1.webp",
  "/images/Siva_old2.webp",
];

const tamilDays = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Approx Tamil Calendar logic just for sample generation (UI handles accurate month changes)
const getTamilApprox = (d) => {
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  // Very rough approximation for sample text fallback when no exact event maps it
  const map = [
    { en: "Margazhi", ta: "மார்கழி" }, // Jan
    { en: "Thai", ta: "தை" }, // Feb
    { en: "Maasi", ta: "மாசி" }, // Mar
    { en: "Panguni", ta: "பங்குனி" }, // Apr
    { en: "Chithirai", ta: "சித்திரை" }, // May
    { en: "Vaikasi", ta: "வைகாசி" }, // Jun
    { en: "Aani", ta: "ஆனி" }, // Jul
    { en: "Aadi", ta: "ஆடி" }, // Aug
    { en: "Aavani", ta: "ஆவணி" }, // Sep
    { en: "Purattasi", ta: "புரட்டாசி" }, // Oct
    { en: "Aippasi", ta: "ஐப்பசி" }, // Nov
    { en: "Karthigai", ta: "கார்த்திகை" }, // Dec
  ];
  return { taMonth: map[m].ta, enMonth: map[m].en, taDay: day };
};

const generateFullCards = () => {
  const dayCards = [];

  const start = new Date(Date.UTC(2026, 0, 1)); // Jan 1 2026
  const end = new Date(Date.UTC(2027, 3, 30)); // Apr 30 2027

  let current = new Date(start);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    const item = eventMap[dateStr];

    const events = [];
    let ayanam = Math.random() > 0.5 ? "uttarayana" : "dakshinayana";
    let moon = Math.random() > 0.5 ? "pournami" : "new_moon";
    let labelTa = "";
    let labelEn = "";
    let dayNum = current.getUTCDate();

    if (item) {
      if (item.natchathiram) {
        events.push({
          title_ta: item.natchathiram,
          title_en: item.natchathiram,
          description_ta: item.desc || "",
          description_en: item.desc || "",
          importance_level: "high",
          icon: "star",
        });
      } else if (item.desc) {
        events.push({
          title_ta: item.desc,
          title_en: item.desc,
          description_ta: "",
          description_en: "",
          importance_level: "high",
          icon: "sparkles",
        });
      }
      ayanam = item.ayanam;
      if (
        item.natchathiram.toLowerCase() === "pournami" ||
        item.desc.toLowerCase().includes("pournami")
      ) {
        moon = "pournami";
      }
      labelTa = `${item.taMonth} ${item.taDay}`;
      labelEn = `${item.taMonth} ${item.taDay}`;
      dayNum = item.taDay;
    } else {
      const approx = getTamilApprox(current);
      labelTa = `${approx.taMonth} ${approx.taDay}`;
      labelEn = `${approx.enMonth} ${approx.taDay}`;
    }

    const img = images[Math.floor(Math.random() * images.length)];

    dayCards.push({
      id: dateStr,
      tamil_date: {
        label_ta: labelTa,
        label_en: labelEn,
        day_ta: String(dayNum),
        day_en: String(dayNum),
      },
      gregorian_date: {
        iso: dateStr,
        display_en: current.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }),
      },
      weekday: {
        ta: tamilDays[current.getUTCDay()],
        en: englishDays[current.getUTCDay()],
      },
      visual: {
        placeholder_image_url: img,
        placeholder_alt_text: "Siva Vaibhava Panchangam Event",
        theme_tag: "regular",
      },
      cycles: {
        lunar_phase_icon: moon,
        solar_cycle_icon: ayanam,
      },
      events: events,
    });

    current.setUTCDate(current.getUTCDate() + 1);
  }

  const exportData = {
    panchangam_title: "Siva Vaibhava Panchangam Events",
    tamil_month: { ta: "பராபவ", en: "Parabhava" },
    tamil_year: { ta: "பராபவ", en: "Parabhava" },
    gregorian_range: {
      start: "2026-01-01",
      end: "2027-04-30",
      days: dayCards.length,
    },
    days: dayCards,
  };

  fs.writeFileSync(
    path.join(__dirname, "public/data/day_cards.json"),
    JSON.stringify(exportData, null, 2),
  );
  console.log("Full year populated in public/data/day_cards.json");
};

generateFullCards();
