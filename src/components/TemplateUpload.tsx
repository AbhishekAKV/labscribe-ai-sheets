
import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface TemplateUploadProps {
  onTemplateUpload: (template: File) => void;
}

const TemplateUpload = ({ onTemplateUpload }: TemplateUploadProps) => {
  const [uploadedTemplate, setUploadedTemplate] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/x-tex',
      'text/x-tex'
    ];
    
    if (allowedTypes.includes(file.type) || file.name.endsWith('.tex') || file.name.endsWith('.docx')) {
      setUploadedTemplate(file);
      onTemplateUpload(file);
    } else {
      alert('Please upload a .docx or .tex file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeTemplate = () => {
    setUploadedTemplate(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white tracking-wider">TEMPLATE UPLOAD</h3>
      
      {!uploadedTemplate ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
            dragActive 
              ? 'border-white/50 bg-white/10' 
              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onClick={() => document.getElementById('template-upload')?.click()}
        >
          <Upload className="mx-auto mb-4 text-white/60" size={32} />
          <p className="text-white/80 mb-2">Upload a template (.docx or .tex)</p>
          <p className="text-white/60 text-sm">
            Drag and drop or click to browse
          </p>
          <p className="text-white/40 text-xs mt-2">
            Use placeholders like {'{introduction}'}, {'{materials}'}, {'{procedure}'}
          </p>
          
          <input
            id="template-upload"
            type="file"
            accept=".docx,.tex"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-white/80" size={20} />
            <div>
              <p className="text-white font-medium">{uploadedTemplate.name}</p>
              <p className="text-white/60 text-sm">
                {(uploadedTemplate.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={removeTemplate}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateUpload;
