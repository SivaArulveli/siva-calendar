import { useState } from "react";
import { DayCard } from "../lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { DayCardForm } from "./DayCardForm";
import { Pencil, Clock, Image as ImageIcon, Sparkles } from "lucide-react";

interface DayCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayCard: DayCard;
  isAdmin: boolean;
  onSave: (card: DayCard) => void;
  onDelete: (id: string) => void;
}

export function DayCardModal({ isOpen, onClose, dayCard, isAdmin, onSave, onDelete }: DayCardModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleClose = () => { setIsEditing(false); onClose(); };
  const handleSave = (updated: DayCard) => { onSave(updated); setIsEditing(false); };
  const handleDelete = (id: string) => { onDelete(id); handleClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white border border-[#dadce0] text-[#202124] p-0 overflow-hidden rounded-2xl shadow-xl">
        {isEditing ? (
          <div className="p-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
            <h2 className="text-xl font-bold text-[#1a73e8] mb-6">Edit Event</h2>
            <DayCardForm
              initialData={dayCard}
              onSave={handleSave}
              onDelete={handleDelete}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="flex flex-col max-h-[88vh] overflow-y-auto custom-scrollbar">

            {/* ── Hero Image / Visual ── */}
            <div className="relative h-56 sm:h-72 shrink-0 overflow-hidden bg-[#f1f3f4] flex justify-center items-center">
              {dayCard.visual?.placeholder_image_url ? (
                <img src={dayCard.visual.placeholder_image_url} alt={dayCard.visual.placeholder_alt_text} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-[#dadce0]" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Tamil badge on top */}
              {dayCard.tamil_date?.label_ta && (
                <div className="absolute top-4 left-5">
                  <span className="bg-white/90 text-[#1a73e8] text-xs font-bold px-3 py-1 rounded shadow-sm tamil-font">
                    {dayCard.tamil_date.label_ta}
                  </span>
                </div>
              )}

              <div className="absolute bottom-5 left-6 right-6 flex flex-col gap-1 text-shadow-sm">
                <p className="text-white/80 font-mono text-xs font-semibold tracking-widest uppercase">
                  {dayCard.gregorian_date?.display_en}
                </p>
                <h2 className="text-white text-3xl font-bold leading-tight">
                  {dayCard.weekday?.ta} · {dayCard.weekday?.en}
                </h2>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="p-6 space-y-6">

              {/* Events Timeline */}
              {dayCard.events && dayCard.events.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#dadce0] pb-2">
                    <Sparkles className="w-5 h-5 text-[#ea4335]" />
                    <h3 className="text-[#ea4335] font-semibold text-sm uppercase tracking-wider">
                      {dayCard.events.length} Event{dayCard.events.length !== 1 ? "s" : ""}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {dayCard.events.map((event, idx) => (
                      <div key={idx} className="flex flex-col gap-1 bg-[#f8f9fa] hover:bg-[#f1f3f4] transition-colors rounded-xl p-4 border border-[#dadce0]">
                        <div className="flex items-start justify-between">
                          <h4 className="text-[#202124] font-bold text-lg tamil-font">
                            {event.title_ta}
                          </h4>
                          {event.importance_level === "high" && (
                            <span className="bg-[#fce8e6] text-[#d93025] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                              High Priority
                            </span>
                          )}
                        </div>
                        <p className="text-[#5f6368] text-sm font-medium mb-2">{event.title_en}</p>
                        
                        {(event.description_ta || event.description_en) && (
                          <div className="mt-2 space-y-1.5 border-t border-[#dadce0] pt-2">
                            {event.description_ta && <p className="text-[#3c4043] text-sm tamil-font">{event.description_ta}</p>}
                            {event.description_en && <p className="text-[#5f6368] text-xs">{event.description_en}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center italic text-[#9aa0a6] text-sm py-10">
                  No auspicious events scheduled for this day.
                </div>
              )}

              {/* Admin Edit */}
              {isAdmin && (
                <div className="flex justify-center pt-4 border-t border-[#dadce0]">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-white hover:bg-[#f8f9fa] border border-[#dadce0] text-[#1a73e8] gap-2 rounded-xl font-bold"
                  >
                    <Pencil className="w-4 h-4" /> Edit Panchangam Data
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
