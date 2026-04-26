import { useState } from "react";
import { DayCard, PanchangamEvent } from "../lib/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Plus, Trash2 } from "lucide-react";

interface DayCardFormProps {
  initialData: DayCard;
  onSave: (data: DayCard) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export function DayCardForm({ initialData, onSave, onDelete, onCancel }: DayCardFormProps) {
  const [formData, setFormData] = useState<DayCard>(initialData);

  const handleNestedChange = (section: keyof DayCard, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, string>),
        [field]: value,
      },
    }));
  };

  const handleEventChange = (index: number, field: keyof PanchangamEvent, value: string) => {
    setFormData((prev) => {
      const newEvents = [...(prev.events || [])];
      newEvents[index] = { ...newEvents[index], [field]: value };
      return { ...prev, events: newEvents };
    });
  };

  const addEvent = () => {
    setFormData((prev) => ({
      ...prev,
      events: [
        ...(prev.events || []),
        {
          title_ta: "",
          title_en: "",
          description_ta: "",
          description_en: "",
          importance_level: "medium",
          icon: "calendar",
        },
      ],
    }));
  };

  const removeEvent = (index: number) => {
    setFormData((prev) => {
      const newEvents = [...(prev.events || [])];
      newEvents.splice(index, 1);
      return { ...prev, events: newEvents };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const labelClass = "text-xs font-semibold uppercase tracking-wider text-[#5f6368]";
  const inputClass =
    "bg-white border-[#dadce0] text-[#202124] placeholder:text-[#9aa0a6] focus:border-[#1a73e8] focus:ring-[#1a73e8]/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tamil Date Section */}
      <div className="bg-[#e8f0fe] border border-[#c5d8fc] rounded-xl p-4 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1a73e8]">
          Tamil Date (தமிழ் தேதி)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className={labelClass}>Label (Tamil)</Label>
            <Input
              value={formData.tamil_date?.label_ta || ""}
              onChange={(e) => handleNestedChange("tamil_date", "label_ta", e.target.value)}
              placeholder="e.g. சித்திரை 1"
              className={`${inputClass} tamil-font`}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Label (English)</Label>
            <Input
              value={formData.tamil_date?.label_en || ""}
              onChange={(e) => handleNestedChange("tamil_date", "label_en", e.target.value)}
              placeholder="e.g. Chithirai 1"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Day Number (Tamil)</Label>
            <Input
              value={formData.tamil_date?.day_ta || ""}
              onChange={(e) => handleNestedChange("tamil_date", "day_ta", e.target.value)}
              className={`${inputClass} tamil-font`}
              required
            />
          </div>
        </div>
      </div>

      {/* Visual & Cycles Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-4 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5f6368]">Visuals</p>
          <div className="space-y-1.5">
            <Label className={labelClass}>Placeholder Image URL</Label>
            <Input
              value={formData.visual?.placeholder_image_url || ""}
              onChange={(e) =>
                handleNestedChange("visual", "placeholder_image_url", e.target.value)
              }
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Alt Text</Label>
            <Input
              value={formData.visual?.placeholder_alt_text || ""}
              onChange={(e) => handleNestedChange("visual", "placeholder_alt_text", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-4 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5f6368]">Cycles</p>
          <div className="space-y-1.5">
            <Label className={labelClass}>Lunar Phase Icon</Label>
            <Input
              value={formData.cycles?.lunar_phase_icon || ""}
              onChange={(e) => handleNestedChange("cycles", "lunar_phase_icon", e.target.value)}
              placeholder="e.g. pournami, new_moon"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Solar Cycle Icon</Label>
            <Input
              value={formData.cycles?.solar_cycle_icon || ""}
              onChange={(e) => handleNestedChange("cycles", "solar_cycle_icon", e.target.value)}
              placeholder="e.g. uttarayana, dakshinayana"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className={labelClass}>Events</Label>
          <Button
            type="button"
            size="sm"
            onClick={addEvent}
            className="h-7 px-3 text-xs bg-[#1a73e8]/10 hover:bg-[#1a73e8]/20 text-[#1a73e8] border border-[#1a73e8]/30"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Event
          </Button>
        </div>

        {formData.events?.map((event, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0]"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-[#5f6368]">Event #{index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                onClick={() => removeEvent(index)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Title (Tamil)"
                value={event.title_ta}
                onChange={(e) => handleEventChange(index, "title_ta", e.target.value)}
                className={`h-9 text-sm tamil-font ${inputClass}`}
                required
              />
              <Input
                placeholder="Title (English)"
                value={event.title_en}
                onChange={(e) => handleEventChange(index, "title_en", e.target.value)}
                className={`h-9 text-sm ${inputClass}`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Textarea
                placeholder="Description (Tamil)"
                value={event.description_ta || ""}
                onChange={(e) => handleEventChange(index, "description_ta", e.target.value)}
                className={`text-sm tamil-font ${inputClass}`}
                rows={2}
              />
              <Textarea
                placeholder="Description (English)"
                value={event.description_en || ""}
                onChange={(e) => handleEventChange(index, "description_en", e.target.value)}
                className={`text-sm ${inputClass}`}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Importance (high, medium, low)"
                value={event.importance_level || ""}
                onChange={(e) => handleEventChange(index, "importance_level", e.target.value)}
                className={`h-9 text-sm ${inputClass}`}
              />
              <Input
                placeholder="Icon Identifier"
                value={event.icon || ""}
                onChange={(e) => handleEventChange(index, "icon", e.target.value)}
                className={`h-9 text-sm ${inputClass}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-[#dadce0]">
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => onDelete(initialData.id)}
            className="mr-auto"
          >
            Delete Card
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold px-6">
          Save Card
        </Button>
      </div>
    </form>
  );
}
