import { motion } from "framer-motion";
import { DayCard } from "../lib/types";
import { resolveAsset } from "../lib/utils";

interface FloatingDayCardProps {
  dayCard: DayCard;
  onClick: () => void;
}

export function FloatingDayCard({ dayCard, onClick }: FloatingDayCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel rounded-3xl overflow-hidden cursor-pointer group relative flex flex-col h-[420px]"
    >
      {/* Hero Image Section */}
      <div className="relative h-48 shrink-0 overflow-hidden bg-black/20">
        {dayCard.visual?.placeholder_image_url ? (
          <img
            src={resolveAsset(dayCard.visual.placeholder_image_url)}
            alt="Event visual"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span className="text-4xl opacity-50">✨</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />

        {/* Date Badge */}
        <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-1">
          {dayCard.tamil_date?.label_ta && (
            <div className="text-white/90 text-sm font-semibold tamil-font drop-shadow-md">
              {dayCard.tamil_date.label_ta}
            </div>
          )}
          <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
            {dayCard.gregorian_date?.display_en}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 gap-4 overflow-hidden">
        {/* Spacer to push events to bottom if quote is short */}
        <div className="flex-1" />

        {/* Events Preview */}
        {dayCard.events && dayCard.events.length > 0 && (
          <div className="space-y-2 mt-auto">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--color-accent),0.8)]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {dayCard.events.length} Event{dayCard.events.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-1.5">
              {dayCard.events.slice(0, 2).map((event, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm bg-white/5 rounded-md px-2.5 py-1.5"
                  >
                    <span className="truncate font-medium text-foreground/80 mr-2">
                      {event.title_ta}
                    </span>
                    <span className="text-xs text-primary font-mono shrink-0">
                      {event.importance_level}
                    </span>
                  </div>
                );
              })}
              {dayCard.events.length > 2 && (
                <div className="text-xs text-center text-muted-foreground pt-1">
                  +{dayCard.events.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subtle hover glow border */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/0 group-hover:ring-primary/50 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
}
