
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type,
  Download,
  ArrowLeft,
  BorderAll,
  Palette,
  Plus,
  Minus
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface EditorProps {}

const Editor = ({}: EditorProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  
  const [content, setContent] = useState(location.state?.content || '');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showBorders, setShowBorders] = useState(false);

  useEffect(() => {
    if (editorRef.current && content) {
      editorRef.current.innerHTML = content.replace(/\n/g, '<br>');
    }
  }, []);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    executeCommand('fontName', font);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    executeCommand('fontSize', '3');
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = `${size}px`;
        try {
          range.surroundContents(span);
        } catch (e) {
          // If can't surround, just apply to editor
          editorRef.current.style.fontSize = `${size}px`;
        }
      }
    }
  };

  const handleColorChange = (color: string, type: 'text' | 'background') => {
    if (type === 'text') {
      setTextColor(color);
      executeCommand('foreColor', color);
    } else {
      setBackgroundColor(color);
      executeCommand('backColor', color);
    }
  };

  const downloadAsPDF = () => {
    if (!editorRef.current) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Get text content from editor
    const textContent = editorRef.current.innerText;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Laboratory Sheet", margin, 30);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const lines = doc.splitTextToSize(textContent, maxWidth);
    let y = 50;
    
    lines.forEach((line: string) => {
      if (y > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 7;
    });
    
    doc.save('edited-lab-sheet.pdf');
  };

  const downloadAsWord = async () => {
    if (!editorRef.current) return;

    try {
      const textContent = editorRef.current.innerText;
      const paragraphs = textContent.split('\n').map(text => 
        new Paragraph({
          children: [
            new TextRun({
              text: text || ' ',
              size: fontSize * 2, // Word uses half-points
            }),
          ],
        })
      );

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'edited-lab-sheet.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating Word document:', error);
    }
  };

  const addTextElement = () => {
    if (editorRef.current) {
      const newElement = document.createElement('div');
      newElement.innerHTML = '<br>Click here to add text<br>';
      newElement.style.border = showBorders ? '1px dashed #ccc' : 'none';
      newElement.style.padding = '10px';
      newElement.style.margin = '5px 0';
      newElement.contentEditable = 'true';
      editorRef.current.appendChild(newElement);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Generator
            </button>
            <h1 className="text-2xl font-bold text-white tracking-wider">LAB SHEET EDITOR</h1>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={downloadAsPDF}
              className="btn-primary flex items-center gap-2"
            >
              <Download size={16} />
              DOWNLOAD PDF
            </button>
            <button
              onClick={downloadAsWord}
              className="btn-primary flex items-center gap-2"
            >
              <Download size={16} />
              DOWNLOAD WORD
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Font Controls */}
            <div className="flex items-center gap-2">
              <select
                value={selectedFont}
                onChange={(e) => handleFontChange(e.target.value)}
                className="bg-black/50 border border-white/20 rounded px-3 py-1 text-white text-sm"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
              </select>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFontSizeChange(Math.max(8, fontSize - 2))}
                  className="bg-black/50 border border-white/20 rounded p-1 text-white hover:bg-white/10"
                >
                  <Minus size={14} />
                </button>
                <span className="text-white text-sm px-2">{fontSize}px</span>
                <button
                  onClick={() => handleFontSizeChange(Math.min(72, fontSize + 2))}
                  className="bg-black/50 border border-white/20 rounded p-1 text-white hover:bg-white/10"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => executeCommand('bold')}
                className="bg-black/50 border border-white/20 rounded p-2 text-white hover:bg-white/10"
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button
                onClick={() => executeCommand('italic')}
                className="bg-black/50 border border-white/20 rounded p-2 text-white hover:bg-white/10"
                title="Italic"
              >
                <Italic size={16} />
              </button>
              <button
                onClick={() => executeCommand('underline')}
                className="bg-black/50 border border-white/20 rounded p-2 text-white hover:bg-white/10"
                title="Underline"
              >
                <Underline size={16} />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => executeCommand('justifyLeft')}
                className="bg-black/50 border border-white/20 rounded p-2 text-white hover:bg-white/10"
                title="Align Left"
              >
                <AlignLeft size={16} />
              </button>
              <button
                onClick={() => executeCommand('justifyCenter')}
                className="bg-black/50 border border-white/20 rounded p-2 text-white hover:bg-white/10"
                title="Align Center"
              >
                <AlignCenter size={16} />
              </button>
              <button
                onClick={() => executeCommand('justifyRight')}
                className="bg-black/50 border border-white/20 rounded p-2 text-white hover:bg-white/10"
                title="Align Right"
              >
                <AlignRight size={16} />
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Palette size={16} className="text-white/60" />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => handleColorChange(e.target.value, 'text')}
                  className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                  title="Text Color"
                />
              </div>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => handleColorChange(e.target.value, 'background')}
                className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                title="Background Color"
              />
            </div>

            {/* Border Toggle */}
            <button
              onClick={() => setShowBorders(!showBorders)}
              className={`border border-white/20 rounded p-2 transition-colors ${
                showBorders ? 'bg-white/20 text-white' : 'bg-black/50 text-white hover:bg-white/10'
              }`}
              title="Toggle Borders"
            >
              <BorderAll size={16} />
            </button>

            {/* Add Element */}
            <button
              onClick={addTextElement}
              className="bg-black/50 border border-white/20 rounded p-2 text-white hover:bg-white/10 flex items-center gap-1"
              title="Add Text Element"
            >
              <Plus size={16} />
              <Type size={16} />
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className={`min-h-[600px] w-full p-6 text-gray-800 bg-white rounded-lg focus:outline-none ${
              showBorders ? 'border-2 border-dashed border-gray-300' : ''
            }`}
            style={{
              fontFamily: selectedFont,
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
            }}
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              setContent(target.innerHTML);
            }}
          />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white/60 text-sm">
          Click anywhere in the editor to start editing. Use the toolbar above to format your text.
        </div>
      </div>
    </div>
  );
};

export default Editor;
