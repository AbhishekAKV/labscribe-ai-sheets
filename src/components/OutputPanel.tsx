import React from 'react';
import { Download, Loader2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

interface OutputPanelProps {
  content: string;
  isLoading: boolean;
}

const OutputPanel = ({ content, isLoading }: OutputPanelProps) => {
  const navigate = useNavigate();

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

  const downloadLabSheetWord = async () => {
    if (!content) return;

    try {
      // Split content into sections for better formatting
      const sections = content.split(/\n(?=\d+\.\s)/);
      const paragraphs: Paragraph[] = [];

      // Add main title
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Laboratory Sheet",
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.TITLE,
          spacing: { after: 400 },
        })
      );

      // Process each section
      sections.forEach((section) => {
        const lines = section.trim().split('\n');
        
        lines.forEach((line, index) => {
          if (line.trim()) {
            // Check if it's a section header (starts with number)
            const isHeader = /^\d+\.\s/.test(line.trim());
            
            if (isHeader) {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      bold: true,
                      size: 24,
                    }),
                  ],
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 300, after: 200 },
                })
              );
            } else {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      size: 22,
                    }),
                  ],
                  spacing: { after: 100 },
                })
              );
            }
          }
        });
      });

      // Create the document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      // Generate and download the document
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lab-sheet.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Error generating Word document. Please try again.');
    }
  };

  const openInEditor = () => {
    navigate('/editor', { state: { content } });
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
            <div className="flex flex-wrap gap-4 mt-5">
              <button
                onClick={openInEditor}
                className="btn-primary flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
              >
                <Edit size={16} />
                OPEN IN EDITOR
              </button>
              <button
                onClick={downloadLabSheetPDF}
                className="btn-primary flex items-center gap-2"
              >
                <Download size={16} />
                DOWNLOAD PDF
              </button>
              <button
                onClick={downloadLabSheetWord}
                className="btn-primary flex items-center gap-2"
              >
                <Download size={16} />
                DOWNLOAD WORD
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
