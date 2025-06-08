
import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface OutputPanelProps {
  content: string;
  isLoading: boolean;
}

const OutputPanel = ({ content, isLoading }: OutputPanelProps) => {
  const downloadLabSheet = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lab-sheet.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel col-span-1 lg:col-span-2">
      <h2 className="text-2xl mb-6 text-white tracking-[3px]">GENERATED LAB SHEET</h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-white mb-4" size={40} />
          <p className="text-gray-300">Generating your lab sheet with Cohere AI...</p>
        </div>
      ) : (
        <>
          <div className="generated-content">
            {content || `Get your free Cohere API key from: https://dashboard.cohere.ai/api-keys

Benefits of using Cohere:
✓ Generous free tier (no credit card required initially)
✓ High-quality text generation
✓ Fast response times
✓ Great for educational content

Enter your API key above and configure your lab sheet parameters to get started!`}
          </div>
          
          {content && (
            <button
              onClick={downloadLabSheet}
              className="btn-primary mt-5 flex items-center gap-2"
            >
              <Download size={16} />
              DOWNLOAD PDF
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default OutputPanel;
