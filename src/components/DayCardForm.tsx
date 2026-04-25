import { useState } from 'react';
import { DayCard } from '../lib/types';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface DayCardFormProps {
  initialData: DayCard;
  onSave: (data: DayCard) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export function DayCardForm({ initialData, onSave, onDelete, onCancel }: DayCardFormProps) {
  const [formData, setFormData] = useState<DayCard>(initialData);
  const [tagInput, setTagInput] = useState(initialData.tags?.join(', ') || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    onSave({ ...formData, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="kumkum-text font-semibold">Title</Label>
        <Input 
          id="title" 
          name="title" 
          value={formData.title || ''} 
          onChange={handleChange} 
          placeholder="e.g. சுதர்சன ஹோமம்" 
          className="gold-tile"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary" className="kumkum-text font-semibold">Summary</Label>
        <Textarea 
          id="summary" 
          name="summary" 
          value={formData.summary || ''} 
          onChange={handleChange} 
          placeholder="Brief 1-line summary" 
          rows={2}
          className="gold-tile"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="kumkum-text font-semibold">Detailed Notes (Markdown)</Label>
        <Textarea 
          id="notes" 
          name="notes" 
          value={formData.notes || ''} 
          onChange={handleChange} 
          placeholder="Detailed description, supports markdown..." 
          rows={6}
          className="gold-tile"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url" className="kumkum-text font-semibold">Image URL</Label>
        <Input 
          id="image_url" 
          name="image_url" 
          value={formData.image_url || ''} 
          onChange={handleChange} 
          placeholder="https://example.com/image.jpg" 
          className="gold-tile"
        />
        {formData.image_url && (
          <div className="mt-2 rounded-lg overflow-hidden border border-amber-200/50" style={{boxShadow: 'var(--shadow-raised)'}}>
            <img src={formData.image_url} alt="Preview" className="w-full h-auto object-cover max-h-40" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="kumkum-text font-semibold">Tags (comma separated)</Label>
        <Input 
          id="tags" 
          value={tagInput} 
          onChange={(e) => setTagInput(e.target.value)} 
          placeholder="e.g. உபவாசம், ஏகாதசி" 
          className="gold-tile"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        {onDelete && initialData.title && (
          <Button type="button" variant="destructive" onClick={() => onDelete(initialData.id)} className="mr-auto bg-red-800 hover:bg-red-900">
            Delete
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onCancel} className="gold-tile border-amber-200/50">
          Cancel
        </Button>
        <Button type="submit" className="saffron-tile hover:brightness-110 text-amber-950 font-bold">
          Save
        </Button>
      </div>
    </form>
  );
}
