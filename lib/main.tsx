import * as React from "react";
import "./globals.css";
import { Editor } from "./components/Tapwrite";
import { AppContextProvider } from "./context";
import { TiptapEditorUtils } from "./utils/tiptapEditorUtils";
import { Editor as EditorType } from "@tiptap/react";

export interface NotionLikeProps {
  uploadFn?: (file: File, tiptapEditorUtils: TiptapEditorUtils) => void;
  getContent: (content: string) => void;
  content: string;
  readonly?: boolean;
  className?: string;
  placeholder?: string;
  onFocus?: () => void;
  getEditor?: (editor: EditorType | null) => void;
  suggestions?: any;
}

export const Tapwrite = ({
  uploadFn,
  getContent,
  content,
  readonly,
  className,
  placeholder,
  onFocus,
  getEditor,
  suggestions,
}: NotionLikeProps) => {
  return (
    <AppContextProvider>
      <Editor
        uploadFn={uploadFn}
        getContent={getContent}
        content={content}
        readonly={readonly}
        className={className}
        placeholder={placeholder}
        onFocus={onFocus}
        getEditor={getEditor}
        suggestions={suggestions}
      />
    </AppContextProvider>
  );
};

export { TiptapEditorUtils };
