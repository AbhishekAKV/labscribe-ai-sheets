
import React from 'react';
import { FormData } from '../types';
import TemplateUpload from './TemplateUpload';

interface ConfigurationPanelProps {
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  onGenerate: () => void;
}

const ConfigurationPanel = ({ formData, onFormDataChange, onGenerate }: ConfigurationPanelProps) => {
  const handleTemplateUpload = (template: File) => {
    console.log('Template uploaded:', template.name);
    // TODO: Process template file and extract placeholders
  };

  return (
    <div className="panel">
      <h2 className="text-2xl mb-6 text-white tracking-[3px]">CONFIGURATION</h2>
      
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-5 text-blue-200 text-sm">
        <strong>Using Cohere AI:</strong> Get your free API key from{' '}
        <a href="https://dashboard.cohere.ai/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
          dashboard.cohere.ai
        </a>
        <br />✓ Free tier includes generous usage limits
        <br />✓ No credit card required for trial
      </div>

      <div className="space-y-5">
        <div className="form-group">
          <label className="block mb-2 text-gray-300 text-sm tracking-wider">Subject</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => onFormDataChange({ subject: e.target.value })}
            placeholder="e.g., Organic Chemistry, Physics, Biology"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="block mb-2 text-gray-300 text-sm tracking-wider">Experiment Title</label>
          <input
            type="text"
            value={formData.experiment}
            onChange={(e) => onFormDataChange({ experiment: e.target.value })}
            placeholder="e.g., Synthesis of Aspirin"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="block mb-2 text-gray-300 text-sm tracking-wider">Cohere API Key</label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={(e) => onFormDataChange({ apiKey: e.target.value })}
            placeholder="Your Cohere API key..."
            className="form-input font-mono"
          />
        </div>

        <div className="form-group">
          <label className="block mb-2 text-gray-300 text-sm tracking-wider">AI Model</label>
          <select
            value={formData.model}
            onChange={(e) => onFormDataChange({ model: e.target.value })}
            className="form-input"
          >
            <option value="command">Command (Recommended)</option>
            <option value="command-light">Command Light (Faster)</option>
            <option value="command-nightly">Command Nightly (Latest)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="block mb-2 text-gray-300 text-sm tracking-wider">Additional Instructions/Matter</label>
          <textarea
            value={formData.customPrompt}
            onChange={(e) => onFormDataChange({ customPrompt: e.target.value })}
            rows={4}
            placeholder="Add specific requirements, topics to cover, difficulty level, special instructions, or any additional context for the lab sheet..."
            className="form-input resize-vertical"
          />
        </div>

        <TemplateUpload onTemplateUpload={handleTemplateUpload} />
      </div>
    </div>
  );
};

export default ConfigurationPanel;
