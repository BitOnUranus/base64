import React, { useState, useRef, useEffect } from 'react';
import { Upload, Save, Copy, FileText, Info } from 'lucide-react';
import Editor from './Editor';
import PredefPanel from './PredefPanel';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import mammoth from 'mammoth';
import { encodeContent, decodeContent, saveFile, loadFile, fileExists } from '../utils/fileUtils';

const FILE_NAME = 'editor-content.b64';

const FileUploadEditor: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [base64Content, setBase64Content] = useState<string>('');
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);
  const [isFileSaved, setIsFileSaved] = useState<boolean>(true);
  const [usedItems, setUsedItems] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [predefinedItems] = useState([
    { id: 'item-1', content: 'Thank you for your submission.' },
    { id: 'item-2', content: 'Please review the attached document.' },
    { id: 'item-3', content: 'We appreciate your patience during this process.' },
    { id: 'item-4', content: 'Let me know if you have any questions.' },
    { id: 'item-5', content: 'I look forward to our meeting next week.' },
    { id: 'item-6', content: 'Please confirm receipt of this email.' },
    { id: 'item-7', content: 'Best regards,' },
  ]);

  useEffect(() => {
    const loadSavedContent = async () => {
      const exists = await fileExists(FILE_NAME);
      if (exists) {
        try {
          const savedBase64 = await loadFile(FILE_NAME);
          setBase64Content(savedBase64);
          const decodedContent = decodeContent(savedBase64);
          setContent(decodedContent);
          setIsContentLoaded(true);
          toast.success('Previously saved content loaded');
        } catch (error) {
          console.error('Failed to load saved content:', error);
          toast.error('Failed to load saved content');
        }
      }
    };

    loadSavedContent();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let processedContent: string;

      if (file.name.toLowerCase().endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        processedContent = result.value;
      } else {
        const allowedTypes = ['text/plain', 'text/markdown', 'text/html'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Please upload only text or Word (.docx) files');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }

        const text = await file.text();
        processedContent = text
          .replace(/^\uFEFF/, '')
          .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, '');
      }

      setContent(processedContent);
      setIsContentLoaded(true);
      setIsFileSaved(false);
      toast.success(`File "${file.name}" loaded successfully`);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file content');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
    setIsFileSaved(false);
  };

  const handleSave = async () => {
    try {
      const encoded = encodeContent(content);
      setBase64Content(encoded);
      await saveFile(FILE_NAME, encoded);
      setIsFileSaved(true);
      toast.success('Content saved successfully');
    } catch (error) {
      console.error('Failed to save content:', error);
      toast.error('Failed to save content');
    }
  };

  const handleCopyBase64 = () => {
    if (!base64Content) {
      toast.error('No content to copy');
      return;
    }
    
    navigator.clipboard.writeText(base64Content)
      .then(() => toast.success('Base64 content copied to clipboard'))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (over.id === 'editor') {
      const draggedItem = predefinedItems.find(item => item.id === active.id);
      if (draggedItem) {
        const newContent = `${content}${content ? '\n' : ''}${draggedItem.content}`;
        setContent(newContent);
        setIsFileSaved(false);
        setUsedItems(prev => new Set([...prev, draggedItem.id]));
        toast.success('Text added to editor');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all">
      <div className="p-4 bg-slate-100 border-b flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex items-center px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
          >
            <Upload size={16} className="mr-2" />
            <span>Upload File</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".txt,.md,.html,.docx"
          />
          
          <button 
            onClick={handleSave} 
            className={`flex items-center px-4 py-2 rounded transition-colors ${
              isFileSaved 
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                : 'bg-teal-600 text-white hover:bg-teal-500'
            }`}
            disabled={isFileSaved}
          >
            <Save size={16} className="mr-2" />
            <span>Save Content</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleCopyBase64} 
            className="flex items-center px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
            disabled={!base64Content}
          >
            <Copy size={16} className="mr-2" />
            <span>Copy Base64</span>
          </button>
          
          {isContentLoaded && (
            <div className="flex items-center text-green-600">
              <FileText size={16} className="mr-1" />
              <span className="text-sm">Content loaded</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-1 bg-slate-200 text-xs text-slate-600 flex items-center">
        <Info size={14} className="mr-1 ml-2" />
        <span>Drag and drop predefined text into the editor. Content will be saved in base64 format.</span>
      </div>
      
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-3 text-slate-700">Document Editor</h2>
            <Editor 
              content={content} 
              onChange={handleEditorChange} 
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3 text-slate-700">Predefined Text</h2>
            <PredefPanel items={predefinedItems} usedItems={usedItems} />
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default FileUploadEditor;