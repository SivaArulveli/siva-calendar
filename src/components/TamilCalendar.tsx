import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TAMIL_YEARS_60,
  TAMIL_MONTHS,
  TAMIL_WEEKDAYS,
  getStartWeekday,
  getTamilMonthStartDate,
  toTamilNumber,
} from "@/lib/tamil-calendar";

export function TamilCalendar() {
  const todayYearIdx = useMemo(
    () => ((new Date().getFullYear() - 1987) % 60 + 60) % 60,
    [],
  );
  const [yearIdx, setYearIdx] = useState(todayYearIdx);
  const [monthIdx, setMonthIdx] = useState(0);

  const startWeekday = getStartWeekday(yearIdx, monthIdx);
  const monthMeta = TAMIL_MONTHS[monthIdx];
  const yearMeta = TAMIL_YEARS_60[yearIdx];
  const startDate = getTamilMonthStartDate(yearIdx, monthIdx);

  // Build a 7-column traditional grid: leading blanks + dates
  const cells = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= monthMeta.days; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [startWeekday, monthMeta.days]);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + monthMeta.days - 1);

  const today = new Date();
  const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const todayInMonth =
    todayTime >= startDate.getTime() && todayTime <= endDate.getTime()
      ? Math.round((todayTime - startDate.getTime()) / 86400000) + 1
      : -1;

  // Map Tamil day -> Gregorian {day, monthShort}
  const gregFor = (tamilDay: number) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + tamilDay - 1);
    return {
      day: d.getDate(),
      mon: d.toLocaleDateString(undefined, { month: "short" }),
    };
  };

  const rangeLabel = `${startDate.toLocaleDateString(undefined, { day: "numeric", month: "short" })} – ${endDate.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Outer temple plate */}
      <div className="relative rounded-3xl p-4 sm:p-6 md:p-8 temple-plate" style={{ boxShadow: "var(--shadow-deep)" }}>
        {/* Corner kolam dots */}
        {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((c) => (
          <div key={c} className={`kolam-dot absolute ${c}`} />
        ))}

        {/* Header crown */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="kumkum-text text-xl">❀</span>
            <span className="tamil-font kumkum-text text-sm sm:text-base font-semibold tracking-widest">
              ஓம்
            </span>
            <span className="kumkum-text text-xl">❀</span>
          </div>
          <h1 className="tamil-font kumkum-text text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide leading-tight">
            தமிழ் நிரந்தர நாட்காட்டி
          </h1>
          <p className="serif-font text-[10px] sm:text-xs tracking-[0.25em] uppercase mt-1.5 text-muted-foreground">
            Tamil Perpetual Calendar · 60-Year Cycle
          </p>
          <div className="ornate-divider mt-4 mx-auto max-w-xs" />
        </div>

        {/* Year + Month selectors — stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 sm:mb-5">
          <YearDial yearIdx={yearIdx} setYearIdx={setYearIdx} />
          <MonthDial monthIdx={monthIdx} setMonthIdx={setMonthIdx} />
        </div>

        {/* Status panel */}
        <div className="panel-recessed rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 text-center">
          <div className="tamil-font kumkum-text text-base sm:text-lg font-semibold leading-snug">
            {yearMeta.ta} வருடம் · {monthMeta.ta} மாதம்
          </div>
          <div className="serif-font text-xs text-muted-foreground mt-1 italic">
            {yearMeta.en} · {monthMeta.en}
          </div>
          <div className="text-[11px] sm:text-xs text-muted-foreground mt-2">
            <span className="opacity-70">பிறப்பு / Begins:</span>{" "}
            <span className="tamil-font kumkum-text font-semibold">
              {TAMIL_WEEKDAYS[startWeekday].ta}
            </span>
          </div>
          <div className="serif-font text-[11px] sm:text-xs mt-1 font-semibold">
            {rangeLabel}
          </div>
        </div>

        {/* Calendar grid panel */}
        <div className="panel-recessed rounded-2xl p-2.5 sm:p-4">
          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
            {TAMIL_WEEKDAYS.map((d, i) => (
              <div
                key={i}
                className="saffron-tile rounded-md sm:rounded-lg flex flex-col items-center justify-center py-1.5 sm:py-2"
                style={{ boxShadow: "var(--shadow-raised)" }}
              >
                <span className="tamil-font embossed-text text-[10px] sm:text-xs font-bold leading-tight text-center">
                  {d.ta}
                </span>
                <span className="embossed-text text-[8px] sm:text-[9px] opacity-80 leading-none mt-0.5 hidden sm:block">
                  {d.en}
                </span>
              </div>
            ))}
          </div>

          {/* Date grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${yearIdx}-${monthIdx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-7 gap-1 sm:gap-1.5"
            >
              {cells.map((n, i) => {
                if (n === null) {
                  return <div key={i} className="aspect-square" />;
                }
                const isToday = n === todayInMonth;
                const g = gregFor(n);
                const isMonthFirst = g.day === 1;
                return (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-md sm:rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105 ${
                      isToday ? "saffron-tile today-pulse" : "gold-tile"
                    }`}
                    style={{ boxShadow: "var(--shadow-raised)" }}
                  >
                    <span
                      className={`text-sm sm:text-base md:text-lg font-bold leading-none ${
                        isToday ? "embossed-text" : "engraved-text"
                      }`}
                    >
                      {n}
                    </span>
                    <span
                      className={`tamil-font text-[8px] sm:text-[9px] leading-none mt-0.5 opacity-70 ${
                        isToday ? "embossed-text" : "engraved-text"
                      }`}
                    >
                      {toTamilNumber(n)}
                    </span>
                    <span
                      className={`absolute bottom-0.5 right-1 serif-font text-[8px] sm:text-[9px] font-semibold leading-none opacity-80 ${
                        isToday ? "embossed-text" : "kumkum-text"
                      }`}
                    >
                      {isMonthFirst ? `${g.mon} ${g.day}` : g.day}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <p className="serif-font text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4 text-center italic px-2">
            தமிழ் மாதங்கள் சங்கராந்தியில் தொடங்கும் — months begin on the Sun's zodiac transit (between the 13th – 17th).
          </p>
        </div>
      </div>
    </div>
  );
}

function YearDial({ yearIdx, setYearIdx }: { yearIdx: number; setYearIdx: (n: number) => void }) {
  return (
    <div className="panel-recessed rounded-xl p-2.5 sm:p-3">
      <label className="serif-font text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1.5 px-1 text-center">
        ஆண்டு · Year
      </label>
      <div className="flex items-center gap-1.5">
        <DialButton onClick={() => setYearIdx((yearIdx + 59) % 60)} aria-label="Previous year">‹</DialButton>
        <select
          value={yearIdx}
          onChange={(e) => setYearIdx(parseInt(e.target.value, 10))}
          className="gold-tile flex-1 min-w-0 rounded-md px-2 py-2 engraved-text font-semibold tamil-font text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ boxShadow: "var(--shadow-raised)" }}
        >
          {TAMIL_YEARS_60.map((y, i) => (
            <option key={i} value={i}>
              {y.ta} ({y.en})
            </option>
          ))}
        </select>
        <DialButton onClick={() => setYearIdx((yearIdx + 1) % 60)} aria-label="Next year">›</DialButton>
      </div>
    </div>
  );
}

function MonthDial({ monthIdx, setMonthIdx }: { monthIdx: number; setMonthIdx: (n: number) => void }) {
  return (
    <div className="panel-recessed rounded-xl p-2.5 sm:p-3">
      <label className="serif-font text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1.5 px-1 text-center">
        மாதம் · Month
      </label>
      <div className="flex items-center gap-1.5">
        <DialButton onClick={() => setMonthIdx((monthIdx + 11) % 12)} aria-label="Previous month">‹</DialButton>
        <div
          className="gold-tile flex-1 min-w-0 overflow-hidden rounded-md h-10 sm:h-11 relative"
          style={{ boxShadow: "var(--shadow-raised)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={monthIdx}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="absolute inset-0 flex items-center justify-center gap-2 px-2"
            >
              <span className="tamil-font engraved-text text-sm sm:text-base font-bold truncate">
                {TAMIL_MONTHS[monthIdx].ta}
              </span>
              <span className="engraved-text text-[10px] sm:text-xs opacity-70 truncate">
                {TAMIL_MONTHS[monthIdx].en}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        <DialButton onClick={() => setMonthIdx((monthIdx + 1) % 12)} aria-label="Next month">›</DialButton>
      </div>
    </div>
  );
}

function DialButton({
  onClick,
  children,
  ...rest
}: { onClick: () => void; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className="saffron-tile flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center embossed-text font-bold text-lg active:scale-90 transition-transform"
      style={{ boxShadow: "var(--shadow-raised)" }}
      {...rest}
    >
      {children}
    </button>
  );
}
