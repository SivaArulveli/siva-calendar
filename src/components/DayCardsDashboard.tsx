import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TAMIL_MONTHS,
  TAMIL_YEARS_60,
  TAMIL_WEEKDAYS,
  getTamilMonthStartDate,
} from "../lib/tamil-calendar";
import { DayCard, MonthExport } from "../lib/types";
import { resolveAsset } from "../lib/utils";
import { useDayCards } from "../hooks/useDayCards";
import { DayCardModal } from "./DayCardModal";
import { DayCardForm } from "./DayCardForm";
import { useAdmin } from "../hooks/useAdmin";
import { Button } from "./ui/button";
import {
  ChevronLeft, ChevronRight, Download, Upload,
  LogOut, Plus, Moon, Sun, Sunrise, Sunset, Sparkles, Image as ImageIcon
} from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface CellData {
  gregDate: string | null;
  gregDay: number | null;
  gregMonthShort: string | null;
  isToday: boolean;
  isMonthBoundary: boolean;
  dayCard?: DayCard;
  isPadding: boolean;
  tamilDay?: number; // Added to store the calculated Tamil day
}

// ─────────────────────────────────────────────
// Smart Year/Month Switcher
// ─────────────────────────────────────────────
interface SwitcherProps {
  yearIdx: number;
  monthIdx: number;
  onYearChange: (y: number) => void;
  onMonthChange: (m: number) => void;
}

function YearMonthSwitcher({ yearIdx, monthIdx, onYearChange, onMonthChange }: SwitcherProps) {
  const month = TAMIL_MONTHS[monthIdx];
  const year = TAMIL_YEARS_60[yearIdx];

  const prev = () => {
    if (monthIdx === 0) { onMonthChange(11); onYearChange((yearIdx - 1 + 60) % 60); }
    else onMonthChange(monthIdx - 1);
  };
  const next = () => {
    if (monthIdx === 11) { onMonthChange(0); onYearChange((yearIdx + 1) % 60); }
    else onMonthChange(monthIdx + 1);
  };

  const selectClass = "appearance-none bg-transparent border-none text-[#202124] text-sm focus:outline-none cursor-pointer pr-4 font-bold";

  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto sm:mx-0">
      <button onClick={prev} className="p-2 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center sm:flex-row sm:gap-6 text-center">
        <div className="flex flex-col relative group">
          <div className="flex items-center">
            <select value={monthIdx} onChange={e => onMonthChange(+e.target.value)} className={`${selectClass} text-xl sm:text-2xl text-[#1a73e8] tamil-font tracking-wide`}>
              {TAMIL_MONTHS.map((m, i) => (
                <option key={i} value={i} className="text-[#202124]">{m.ta}</option>
              ))}
            </select>
          </div>
          <span className="text-[#5f6368] text-xs font-semibold uppercase tracking-widest">{month.en}</span>
        </div>

        <div className="hidden sm:block w-px h-8 bg-[#dadce0]" />

        <div className="flex flex-col relative group mt-1 sm:mt-0">
          <div className="flex items-center">
            <select value={yearIdx} onChange={e => onYearChange(+e.target.value)} className={`${selectClass} text-lg sm:text-xl text-[#1a73e8] tamil-font`}>
              {TAMIL_YEARS_60.map((y, i) => (
                <option key={i} value={i} className="text-[#202124]">{y.ta} வருடம்</option>
              ))}
            </select>
          </div>
          <span className="text-[#5f6368] text-[10px] uppercase tracking-wider">{year.en} Year</span>
        </div>
      </div>

      <button onClick={next} className="p-2 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Day Cell
// ─────────────────────────────────────────────
function DayCell({ cell, isAdmin, onClick }: { cell: CellData; isAdmin: boolean; onClick: () => void }) {
  if (cell.isPadding) {
    return <div className="rounded-xl border border-transparent bg-transparent opacity-30 h-full min-h-[140px]" />;
  }

  const hasCard = !!cell.dayCard;
  const card = cell.dayCard!;

  const renderMoon = (phase?: string) => {
    if (phase === 'pournami') return <Moon className="w-3.5 h-3.5 fill-[#1a73e8] text-[#1a73e8]" />;
    if (phase === 'new_moon') return <Moon className="w-3.5 h-3.5 fill-[#202124] text-[#202124]" />;
    return <Moon className="w-3.5 h-3.5 text-[#5f6368]" />;
  };

  const renderSun = (cycle?: string) => {
    if (cycle === 'uttarayana') return <Sunrise className="w-3.5 h-3.5 text-[#ea4335]" />;
    if (cycle === 'dakshinayana') return <Sunset className="w-3.5 h-3.5 text-[#ea4335]" />;
    return <Sun className="w-3.5 h-3.5 text-[#ea4335]" />;
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex flex-col rounded-xl overflow-hidden h-full min-h-[140px] text-left group focus:outline-none transition-shadow
        ${hasCard ? "bg-white shadow-sm border border-[#dadce0] hover:shadow-md" : "bg-white border border-[#dadce0]"}
        ${cell.isToday ? "ring-2 ring-[#1a73e8]" : ""}
        ${isAdmin && !hasCard ? "cursor-pointer hover:border-[#1a73e8]" : "cursor-pointer"}
      `}
    >
      {hasCard ? (
        <>
          {/* Top Band: Date Hierarchy */}
          <div className="flex justify-between items-start p-2 border-b border-[#dadce0]/50 bg-[#f8f9fa]">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1a73e8] tamil-font flex items-center gap-1">
                {cell.tamilDay} <span className="bg-[#e8f0fe] text-[#1a73e8] text-[8px] px-1 rounded font-medium border border-[#c5d8fc]">தமிழ்</span>
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono text-[#5f6368] flex items-center gap-1">
                <span className="bg-[#f1f3f4] text-[#5f6368] text-[8px] px-1 rounded border border-[#dadce0]">EN</span> {cell.gregDay}
              </span>
            </div>
          </div>

          {/* Middle Band: Visual Image */}
          <div className="relative w-full bg-[#f1f3f4] flex items-center justify-center overflow-hidden shrink-0 border-b border-[#dadce0]/50">
            {card.visual?.placeholder_image_url ? (
              <img 
                src={resolveAsset(card.visual.placeholder_image_url)} 
                alt={card.visual.placeholder_alt_text} 
                className="w-full h-auto object-contain transition-transform group-hover:scale-105" 
                onError={(e) => {
                  console.error("Image failed to load:", card.visual.placeholder_image_url);
                  e.currentTarget.src = resolveAsset("/images/lord_shiva.png") || "";
                }}
              />
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <ImageIcon className="w-5 h-5 text-[#5f6368]" />
              </div>
            )}
            {isAdmin && (
              <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <span className="text-[#202124] text-[10px] font-bold">Edit image</span>
              </div>
            )}
          </div>

          {/* Bottom Band: Events & Icons */}
          <div className="flex-1 p-2 flex flex-col bg-white">
            {card.events && card.events.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-1">
                  {card.events[0].importance_level === 'high' && <Sparkles className="w-3 h-3 text-[#ea4335]" />}
                  <p className="text-[10px] font-semibold text-[#202124] tamil-font leading-tight line-clamp-2">
                    {card.events[0].title_ta}
                  </p>
                </div>
                {card.events.length > 1 && (
                  <span className="inline-block mt-1 bg-[#f1f3f4] text-[#5f6368] text-[8px] px-1.5 py-0.5 rounded-full border border-[#dadce0]">
                    +{card.events.length - 1} more
                  </span>
                )}
              </div>
            )}
            
            <div className="mt-auto flex justify-end gap-1.5 pt-1">
              <div title={card.cycles?.solar_cycle_icon} className="bg-[#fce8e6] p-1 rounded-full">
                {renderSun(card.cycles?.solar_cycle_icon)}
              </div>
              <div title={card.cycles?.lunar_phase_icon} className="bg-[#e8f0fe] p-1 rounded-full">
                {renderMoon(card.cycles?.lunar_phase_icon)}
              </div>
            </div>
          </div>
        </>
      ) : (
        // Empty State
        <div className="flex flex-col h-full p-2 bg-[#f8f9fa]">
          <div className="flex justify-between items-start">
             <span className="text-xs font-bold text-[#1a73e8] tamil-font">
               {cell.tamilDay} <span className="bg-[#e8f0fe] text-[#1a73e8] text-[8px] px-1 rounded font-medium border border-[#c5d8fc]">தமிழ்</span>
             </span>
             <span className="text-xs font-mono text-[#5f6368]">{cell.gregDay}</span>
          </div>
          {isAdmin && (
            <div className="mt-auto flex items-center justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-4 h-4 text-[#1a73e8]" />
            </div>
          )}
        </div>
      )}
    </motion.button>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
export function DayCardsDashboard() {
  const { dayCards, saveCard, deleteCard, exportMonth, importData } = useDayCards();
  const { isAdmin, login, logout } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const defaultMonthIdx = () => {
    const map: Record<number, number> = { 3: 0, 4: 1, 5: 2, 6: 3, 7: 4, 8: 5, 9: 6, 10: 7, 11: 8, 0: 9, 1: 10, 2: 11 };
    return map[today.getMonth()] ?? 0;
  };

  const [yearIdx, setYearIdx] = useState(39); // Parabhava
  const [monthIdx, setMonthIdx] = useState(defaultMonthIdx);
  const [selectedCard, setSelectedCard] = useState<DayCard | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);

  const cardMap = useMemo(() => {
    const m: Record<string, DayCard> = {};
    for (const c of dayCards) m[c.id] = c;
    return m;
  }, [dayCards]);

  const cells: CellData[] = useMemo(() => {
    const meta = TAMIL_MONTHS[monthIdx];
    const start = getTamilMonthStartDate(yearIdx, monthIdx);
    const startWd = start.getUTCDay();
    const todayISO = today.toISOString().split('T')[0];

    const out: CellData[] = [];
    // Padding for start of the month
    for (let i = 0; i < startWd; i++) {
      out.push({ gregDate: null, gregDay: null, gregMonthShort: null, isToday: false, isMonthBoundary: false, isPadding: true });
    }
    // Days of the month
    for (let d = 0; d < meta.days; d++) {
      const dt = new Date(start);
      dt.setUTCDate(dt.getUTCDate() + d);
      const ds = dt.toISOString().split('T')[0];
      const tamilDay = d + 1;
      const card = cardMap[ds];
      // Only show the card if it matches the current Tamil month to prevent "bleeding" from bad data
      const isCorrectMonth = card?.tamil_date?.label_ta?.includes(meta.ta) || card?.tamil_date?.label_en?.includes(meta.en);
      
      out.push({
        gregDate: ds,
        gregDay: dt.getUTCDate(),
        gregMonthShort: dt.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
        isToday: ds === todayISO,
        isMonthBoundary: dt.getUTCDate() === 1 && d > 0,
        dayCard: isCorrectMonth ? card : undefined,
        isPadding: false,
        tamilDay: tamilDay // Pass the explicit Tamil day number to the cell data
      });
    }
    // Padding for end of the month
    while (out.length % 7 !== 0) {
      out.push({ gregDate: null, gregDay: null, gregMonthShort: null, isToday: false, isMonthBoundary: false, isPadding: true });
    }
    return out;
  }, [yearIdx, monthIdx, cardMap]);

  const meta = TAMIL_MONTHS[monthIdx];
  const ymeta = TAMIL_YEARS_60[yearIdx];
  const start = getTamilMonthStartDate(yearIdx, monthIdx);
  const end = new Date(start); end.setDate(end.getDate() + meta.days - 1);

  const handleCellClick = (cell: CellData) => {
    console.log("Cell clicked:", cell);
    if (cell.isPadding || !cell.gregDate) return;
    if (cell.dayCard) {
      console.log("Opening card detail:", cell.dayCard);
      setSelectedCard(cell.dayCard);
      setIsDetailOpen(true);
    } else if (isAdmin) {
      const dt = new Date(cell.gregDate + "T00:00:00Z");
      const defaultImages = [
        "/images/lord_shiva.png",
        "/images/lord_ganesha.png",
        "/images/goddess_parvati.png"
      ];
      const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
      setSelectedCard({
        id: cell.gregDate,
        tamil_date: {
          label_ta: `${meta.ta} ${dt.getDate()}`,
          label_en: `${meta.en} ${dt.getDate()}`,
          day_ta: String(dt.getDate()),
          day_en: String(dt.getDate())
        },
        gregorian_date: {
          iso: cell.gregDate,
          display_en: dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        },
        weekday: {
          ta: TAMIL_WEEKDAYS[dt.getDay()].ta,
          en: TAMIL_WEEKDAYS[dt.getDay()].en
        },
        visual: { placeholder_image_url: randomImage, placeholder_alt_text: "Siva Vaibhava Panchangam Event", theme_tag: "regular" },
        cycles: { lunar_phase_icon: "new_moon", solar_cycle_icon: "uttarayana" },
        events: [],
      });
      setIsNewOpen(true);
    }
  };

  const handleSave = (c: DayCard) => { saveCard(c); setIsDetailOpen(false); setIsNewOpen(false); setSelectedCard(null); };
  const handleDelete = (id: string) => { deleteCard(id); setIsDetailOpen(false); setSelectedCard(null); };

  const handleExport = () => {
    const monthExport: MonthExport = {
      panchangam_title: "Siva Vaibhava Panchangam",
      tamil_month: { ta: meta.ta, en: meta.en },
      tamil_year: { ta: ymeta.ta, en: ymeta.en },
      gregorian_range: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        days: meta.days
      },
      days: cells.filter(c => c.dayCard).map(c => c.dayCard!)
    };
    exportMonth(monthExport);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importData(content)) alert("Data imported successfully!");
        else alert("Failed to import. Please check JSON format.");
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-2 sm:px-4 pb-12 pt-6">

      {/* ── Top Bar ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm border border-[#dadce0] relative overflow-hidden">
        {/* Title row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] tracking-tight mb-1">
              Siva Vaibhava Panchangam
            </h1>
            <p className="text-[#5f6368] text-xs uppercase tracking-widest font-semibold">
              Digital Sanctuary Calendar
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Button size="sm" onClick={handleExport} className="bg-[#1a73e8] text-white hover:bg-[#1557b0] text-xs gap-1.5 shadow-sm border-none rounded-lg">
                  <Download className="w-3.5 h-3.5" /> Month JSON
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                <Button size="sm" onClick={() => fileInputRef.current?.click()} variant="outline" className="border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124] text-xs gap-1.5 bg-white rounded-lg">
                  <Upload className="w-3.5 h-3.5" /> Import
                </Button>
                <Button size="sm" onClick={logout} variant="ghost" className="text-[#5f6368] hover:text-[#202124] text-xs gap-1.5 hover:bg-[#f8f9fa] rounded-lg">
                  <LogOut className="w-3.5 h-3.5" /> Exit Admin
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" className="border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124] text-xs bg-white rounded-lg" onClick={() => { const c = prompt("Passcode:"); if (c) login(c); }}>
                Admin
              </Button>
            )}
          </div>
        </div>

        {/* Switcher */}
        <div className="relative z-10 bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0] flex justify-center">
          <YearMonthSwitcher yearIdx={yearIdx} monthIdx={monthIdx} onYearChange={setYearIdx} onMonthChange={setMonthIdx} />
        </div>
      </div>

      {/* ── Weekday Header ── */}
      <div className="grid grid-cols-7 gap-2">
        {TAMIL_WEEKDAYS.map((d, i) => (
          <div key={i} className="flex flex-col items-center py-2 px-1 rounded-lg bg-white border border-[#dadce0] shadow-sm">
            <span className="tamil-font text-[#1a73e8] text-sm font-bold">{d.ta}</span>
            <span className="text-[#5f6368] text-[10px] uppercase font-semibold tracking-wider mt-0.5">{d.en}</span>
          </div>
        ))}
      </div>

      {/* ── Calendar Grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${yearIdx}-${monthIdx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3 items-stretch"
        >
          {cells.map((cell, i) => (
            <DayCell key={i} cell={cell} isAdmin={isAdmin} onClick={() => handleCellClick(cell)} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Modals ── */}
      {selectedCard && isDetailOpen && (
        <DayCardModal isOpen={isDetailOpen} onClose={() => { setIsDetailOpen(false); setSelectedCard(null); }} dayCard={selectedCard} isAdmin={isAdmin} onSave={handleSave} onDelete={handleDelete} />
      )}
      {isAdmin && selectedCard && isNewOpen && (
        <Dialog open={isNewOpen} onOpenChange={o => { if (!o) { setIsNewOpen(false); setSelectedCard(null); } }}>
          <DialogContent className="sm:max-w-2xl bg-white border-[#dadce0] text-[#202124] p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-[#1a73e8]">New Event</h2>
            <DayCardForm initialData={selectedCard} onSave={handleSave} onDelete={undefined} onCancel={() => { setIsNewOpen(false); setSelectedCard(null); }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
