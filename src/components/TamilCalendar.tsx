import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import {
  TAMIL_YEARS_60,
  TAMIL_MONTHS,
  TAMIL_WEEKDAYS,
  getStartWeekday,
  getTamilMonthStartDate,
  toTamilNumber,
} from "@/lib/tamil-calendar";

// Cell width must be consistent for grid + sliding header
const CELL = 56; // px
const GAP = 6; // px
const STEP = CELL + GAP;

export function TamilCalendar() {
  // Default: current Gregorian year mapped back into the cycle (Prabhava=1987)
  const todayYearIdx = useMemo(() => ((new Date().getFullYear() - 1987) % 60 + 60) % 60, []);
  const [yearIdx, setYearIdx] = useState(todayYearIdx);
  const [monthIdx, setMonthIdx] = useState(0);

  const startWeekday = getStartWeekday(yearIdx, monthIdx);
  const monthMeta = TAMIL_MONTHS[monthIdx];
  const yearMeta = TAMIL_YEARS_60[yearIdx];
  const startDate = getTamilMonthStartDate(yearIdx, monthIdx);

  // Sliding day-header offset (number of cells shifted right)
  const [shift, setShift] = useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // When year/month changes, auto-align day strip so weekday of 1st sits over column 1
  useEffect(() => {
    // Day strip is a long repeating sequence. Column 1 is at x=0 in grid.
    // We render strip starting from index `shift` with weekday names cycling.
    // To make day-of-1st align with col 1, set shift so weekdays[shift % 7] === startWeekday
    const target = ((startWeekday) % 7 + 7) % 7;
    setShift(target);
    controls.start({ x: 0, transition: { type: "spring", stiffness: 220, damping: 22 } });
    x.set(0);
  }, [yearIdx, monthIdx, startWeekday, controls, x]);

  // Build a long enough day-name strip — enough to span 32 columns + slack
  const stripLength = 40;
  const dayStrip = useMemo(() => {
    return Array.from({ length: stripLength }, (_, i) => TAMIL_WEEKDAYS[(i + shift) % 7]);
  }, [shift]);

  // Snap on drag end
  const stripRef = useRef<HTMLDivElement>(null);
  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const dx = info.offset.x;
    const steps = Math.round(dx / STEP);
    if (steps !== 0) {
      // Negative steps shifts content left → consume cells from start (increase shift)
      setShift((prev) => ((prev - steps) % 7 + 7) % 7);
    }
    controls.start({ x: 0, transition: { type: "spring", stiffness: 260, damping: 24 } });
  };

  const numbers = Array.from({ length: monthMeta.days }, (_, i) => i + 1);

  // Highlight today if applicable
  const today = new Date();
  const sameMonth =
    today.getFullYear() === startDate.getFullYear() &&
    today.getMonth() === startDate.getMonth() &&
    today.getDate() >= startDate.getDate();
  const todayInMonth = sameMonth ? today.getDate() - startDate.getDate() + 1 : -1;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Outer plate */}
      <div
        className="relative rounded-3xl p-6 md:p-10 brushed-metal-plate"
        style={{ boxShadow: "var(--shadow-deep)" }}
      >
        {/* Rivets */}
        {[
          "top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3",
        ].map((c) => (
          <div key={c} className={`rivet absolute ${c}`} />
        ))}

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="tamil-font engraved-text text-3xl md:text-4xl font-bold tracking-wider">
            தமிழ் நிரந்தர நாட்காட்டி
          </h1>
          <p className="engraved-text/80 text-xs md:text-sm tracking-[0.3em] uppercase mt-1 opacity-70">
            Tamil Perpetual Calendar · 60-Year Cycle
          </p>
        </div>

        {/* Year + Month selector panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <YearDial yearIdx={yearIdx} setYearIdx={setYearIdx} />
          <MonthDial monthIdx={monthIdx} setMonthIdx={setMonthIdx} />
        </div>

        {/* Status bar */}
        <div className="panel-recessed rounded-xl p-3 mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            <span className="embossed-text tamil-font text-base font-semibold">
              {yearMeta.ta} வருடம், {monthMeta.ta} மாதம்
            </span>
            <span className="text-muted-foreground ml-3 text-xs">
              {yearMeta.en} · {monthMeta.en}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            1st falls on{" "}
            <span className="tamil-font text-primary font-semibold">
              {TAMIL_WEEKDAYS[startWeekday].ta}
            </span>{" "}
            ({startDate.toDateString()})
          </div>
        </div>

        {/* Calendar window */}
        <div
          className="panel-recessed rounded-2xl p-4 md:p-6 overflow-hidden"
        >
          {/* Sliding day-header */}
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1 flex items-center justify-between">
              <span>Slide weekday strip ←→ to align</span>
              <button
                onClick={() => {
                  const target = ((startWeekday) % 7 + 7) % 7;
                  setShift(target);
                  controls.start({ x: 0, transition: { type: "spring", stiffness: 220, damping: 22 } });
                }}
                className="text-primary hover:underline"
              >
                Auto-align
              </button>
            </div>
            <div className="overflow-hidden rounded-md" style={{ width: "100%" }}>
              <motion.div
                ref={stripRef}
                drag="x"
                dragConstraints={{ left: -STEP * 14, right: STEP * 14 }}
                dragElastic={0.1}
                animate={controls}
                style={{ x }}
                onDragEnd={handleDragEnd}
                className="flex cursor-grab active:cursor-grabbing select-none"
              >
                {dayStrip.map((d, i) => (
                  <div
                    key={i}
                    className="brushed-metal flex items-center justify-center rounded-md mr-[6px] flex-shrink-0"
                    style={{
                      width: CELL,
                      height: CELL * 0.7,
                      boxShadow: "var(--shadow-raised)",
                    }}
                  >
                    <span className="tamil-font engraved-text text-xs md:text-sm font-bold leading-tight text-center px-1">
                      {d.ta}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Date grid: 8 columns × 4 rows = 32 slots */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(8, ${CELL}px)`,
              gap: `${GAP}px`,
              justifyContent: "start",
              overflowX: "auto",
            }}
          >
            {Array.from({ length: 32 }, (_, i) => {
              const n = i + 1;
              const visible = n <= monthMeta.days;
              const isToday = n === todayInMonth;
              return (
                <div
                  key={n}
                  className={`relative rounded-md flex flex-col items-center justify-center transition-all ${
                    visible
                      ? isToday
                        ? "brushed-metal ring-2 ring-destructive"
                        : "brushed-metal hover:brightness-110"
                      : "opacity-20"
                  }`}
                  style={{
                    width: CELL,
                    height: CELL,
                    boxShadow: visible ? "var(--shadow-raised)" : "none",
                  }}
                >
                  {visible && (
                    <>
                      <span className="engraved-text text-lg md:text-xl font-bold leading-none">
                        {n}
                      </span>
                      <span className="engraved-text tamil-font text-[10px] opacity-70 leading-none mt-0.5">
                        {toTamilNumber(n)}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-muted-foreground mt-4 text-center italic">
            Tamil months begin on Sankranti (Sun's zodiac transit) — between the 13th and 17th of a Gregorian month.
          </p>
        </div>
      </div>
    </div>
  );
}

function YearDial({ yearIdx, setYearIdx }: { yearIdx: number; setYearIdx: (n: number) => void }) {
  return (
    <div className="panel-recessed rounded-xl p-3">
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 px-1">
        Tamil Year · ஆண்டு
      </label>
      <div className="flex items-center gap-2">
        <DialButton onClick={() => setYearIdx((yearIdx + 59) % 60)}>‹</DialButton>
        <select
          value={yearIdx}
          onChange={(e) => setYearIdx(parseInt(e.target.value, 10))}
          className="brushed-metal flex-1 rounded-md px-3 py-2 engraved-text font-semibold tamil-font text-base focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ boxShadow: "var(--shadow-raised)" }}
        >
          {TAMIL_YEARS_60.map((y, i) => (
            <option key={i} value={i}>
              {i + 1}. {y.ta} ({y.en})
            </option>
          ))}
        </select>
        <DialButton onClick={() => setYearIdx((yearIdx + 1) % 60)}>›</DialButton>
      </div>
    </div>
  );
}

function MonthDial({ monthIdx, setMonthIdx }: { monthIdx: number; setMonthIdx: (n: number) => void }) {
  return (
    <div className="panel-recessed rounded-xl p-3">
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5 px-1">
        Tamil Month · மாதம்
      </label>
      <div className="flex items-center gap-2">
        <DialButton onClick={() => setMonthIdx((monthIdx + 11) % 12)}>‹</DialButton>
        <div className="flex-1 overflow-hidden rounded-md brushed-metal h-[42px] relative" style={{ boxShadow: "var(--shadow-raised)" }}>
          <motion.div
            key={monthIdx}
            initial={{ y: 42, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="tamil-font engraved-text text-base md:text-lg font-bold">
              {TAMIL_MONTHS[monthIdx].ta}
            </span>
            <span className="engraved-text/70 text-xs ml-2 opacity-70">
              {TAMIL_MONTHS[monthIdx].en}
            </span>
          </motion.div>
        </div>
        <DialButton onClick={() => setMonthIdx((monthIdx + 1) % 12)}>›</DialButton>
      </div>
    </div>
  );
}

function DialButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="brushed-metal w-9 h-9 rounded-full flex items-center justify-center engraved-text font-bold text-lg active:scale-95 transition-transform"
      style={{ boxShadow: "var(--shadow-raised)" }}
    >
      {children}
    </button>
  );
}
