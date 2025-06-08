
import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

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

  const downloadLabSheetPDF = () => {
    if (!content) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Add title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Laboratory Sheet", margin, 30);
    
    // Add content
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Split content into lines and handle page breaks
    const lines = doc.splitTextToSize(content, maxWidth);
    let y = 50;
    
    lines.forEach((line: string) => {
      if (y > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 5;
    });
    
    doc.save('lab-sheet.pdf');
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
            <div className="flex gap-4 mt-5">
              <button
                onClick={downloadLabSheetPDF}
                className="btn-primary flex items-center gap-2"
              >
                <Download size={16} />
                DOWNLOAD PDF
              </button>
              <button
                onClick={downloadLabSheet}
                className="btn-secondary flex items-center gap-2"
              >
                <Download size={16} />
                DOWNLOAD TXT
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OutputPanel;
