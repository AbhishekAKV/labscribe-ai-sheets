
import React from 'react';
import { Plus } from 'lucide-react';
import { Section } from '../types';
import SectionItem from './SectionItem';

interface SectionsPanelProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onGenerate: () => void;
}

const SectionsPanel = ({ sections, onSectionsChange, onGenerate }: SectionsPanelProps) => {
  const addSection = () => {
    const name = prompt('Enter section name:');
    if (name) {
      const newSection: Section = {
        id: Date.now().toString(),
        name,
        content: '',
        images: []
      };
      onSectionsChange([...sections, newSection]);
    }
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    onSectionsChange(
      sections.map(section => 
        section.id === id ? { ...section, ...updates } : section
      )
    );
  };

  const removeSection = (id: string) => {
    if (confirm('Remove this section?')) {
      onSectionsChange(sections.filter(section => section.id !== id));
    }
  };

  return (
    <div className="panel">
      <h2 className="text-2xl mb-6 text-white tracking-[3px]">SECTIONS</h2>
      
      <button
        onClick={addSection}
        className="btn-secondary w-full mb-5 flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        ADD SECTION
      </button>

      <div className="space-y-4 mb-6">
        {sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            onUpdate={updateSection}
            onRemove={removeSection}
          />
        ))}
      </div>

      <button
        onClick={onGenerate}
        className="btn-primary w-full"
      >
        GENERATE LAB SHEET
      </button>
    </div>
  );
};

export default SectionsPanel;
