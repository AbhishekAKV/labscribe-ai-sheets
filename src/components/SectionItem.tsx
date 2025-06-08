
import React, { useState } from 'react';
import { X, GripVertical, Edit, Trash2, Plus } from 'lucide-react';
import { Section } from '../types';

interface SectionItemProps {
  section: Section;
  onUpdate: (id: string, updates: Partial<Section>) => void;
  onRemove: (id: string) => void;
}

const SectionItem = ({ section, onUpdate, onRemove }: SectionItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);

  const handleNameEdit = () => {
    if (isEditing) {
      onUpdate(section.id, { name: editName });
    }
    setIsEditing(!isEditing);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = event.target?.result as string;
          onUpdate(section.id, { 
            images: [...section.images, newImage] 
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    const newImages = section.images.filter((_, i) => i !== index);
    onUpdate(section.id, { images: newImages });
  };

  return (
    <div className="section-item group" draggable>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="text-gray-500 cursor-move" size={16} />
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameEdit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameEdit()}
              className="bg-transparent border-b border-white/30 text-white outline-none"
              autoFocus
            />
          ) : (
            <span className="text-white font-medium">{section.name}</span>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleNameEdit}
            className="section-btn"
            title="Edit section name"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onRemove(section.id)}
            className="section-btn text-red-400 hover:text-red-300"
            title="Remove section"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={section.content}
          onChange={(e) => onUpdate(section.id, { content: e.target.value })}
          placeholder="Add specific instructions, topics to cover, or additional context for this section..."
          className="section-input"
          rows={3}
        />

        {section.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {section.images.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={image} alt="Section visual" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="image-remove"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="add-image-btn">
          <Plus size={16} />
          Add Image
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default SectionItem;
