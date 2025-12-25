import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
  initialValue: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

export function CodeEditor({ initialValue, language = "javascript", onChange, readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsMounted(true);
    
    // Configure editor theme/settings
    monaco.editor.defineTheme('cryptus-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'string', foreground: 'f1fa8c' },
      ],
      colors: {
        'editor.background': '#0E0E11', // Matches --card
        'editor.lineHighlightBackground': '#1f1f2e',
      }
    });
    
    monaco.editor.setTheme('cryptus-dark');
  };

  return (
    <div className="h-full w-full relative group">
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={initialValue}
        theme="vs-dark"
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          fontLigatures: true,
          scrollBeyondLastLine: false,
          readOnly: readOnly,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-card text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Initializing Editor...</span>
          </div>
        }
      />
      {!isMounted && (
        <div className="absolute inset-0 bg-card z-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
