import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useDroppable } from '@dnd-kit/core';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const { setNodeRef } = useDroppable({
    id: 'editor'
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Type or drag content here...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-slate-200 p-2 flex gap-2 bg-slate-50 rounded-t-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('strike') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
          }`}
          title="Strikethrough"
        >
          <Underline size={18} />
        </button>
        <div className="w-px h-6 bg-slate-300 my-auto mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
          }`}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>
      <div
        ref={setNodeRef}
        className="border border-slate-300 rounded-b-lg bg-white overflow-auto min-h-[400px] shadow-sm transition-all hover:shadow focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-opacity-50"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;