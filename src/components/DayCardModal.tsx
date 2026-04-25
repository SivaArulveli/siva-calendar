import { useState } from 'react';
import { DayCard } from '../lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DayCardForm } from './DayCardForm';

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

  // When modal closes, reset edit state
  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleSave = (updatedCard: DayCard) => {
    onSave(updatedCard);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    handleClose();
  };

  const tamilDateStr = `${dayCard.tamil_year_code} · ${dayCard.tamil_month} ${dayCard.tamil_day_number}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px] temple-plate border-amber-200/30 text-amber-950 p-6">
        <div className="absolute top-2 left-2 kolam-dot opacity-50" />
        <div className="absolute top-2 right-2 kolam-dot opacity-50" />
        
        <DialogHeader className="mb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
             <span className="kumkum-text text-sm">❀</span>
             <span className="tamil-font kumkum-text text-xs font-semibold">ஓம்</span>
             <span className="kumkum-text text-sm">❀</span>
          </div>
          <DialogTitle className="tamil-font kumkum-text text-xl text-center">
            {dayCard.title || "நாள் குறிப்பு"}
          </DialogTitle>
          <DialogDescription className="text-center serif-font text-xs opacity-70">
            {tamilDateStr} | {new Date(dayCard.gregorian_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <DayCardForm 
            initialData={dayCard} 
            onSave={handleSave} 
            onDelete={onDelete} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <div className="space-y-4 py-2">
            {dayCard.image_url && (
              <div className="rounded-lg overflow-hidden border border-amber-200/50" style={{boxShadow: 'var(--shadow-raised)'}}>
                <img src={dayCard.image_url} alt={dayCard.image_alt || "Day image"} className="w-full h-auto object-cover max-h-60" />
              </div>
            )}
            
            {dayCard.summary && (
              <p className="font-semibold text-center text-sm px-4">
                {dayCard.summary}
              </p>
            )}

            {dayCard.notes && (
              <div className="prose prose-amber prose-sm max-w-none panel-recessed p-4 rounded-xl text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {dayCard.notes}
                </ReactMarkdown>
              </div>
            )}

            {!dayCard.title && !dayCard.summary && !dayCard.notes && (
              <p className="text-center italic opacity-60 text-sm py-4">No detailed notes available for this day.</p>
            )}

            {dayCard.tags && dayCard.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {dayCard.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gold-tile text-xs px-2 py-0.5 border-amber-200/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {isAdmin && (
              <div className="flex justify-center pt-4">
                <Button onClick={() => setIsEditing(true)} className="saffron-tile hover:brightness-110 text-amber-950 font-bold" style={{boxShadow: 'var(--shadow-raised)'}}>
                  நாள் குறிப்பை திருத்து (Edit)
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
