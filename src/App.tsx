import React from 'react';
import { Toaster } from 'react-hot-toast';
import FileUploadEditor from './components/FileUploadEditor';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-800 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Document Editor</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <FileUploadEditor />
      </main>
      
      <footer className="bg-slate-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} Document Editor. All rights reserved.</p>
        </div>
      </footer>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;