import * as React from "react";
import "./globals.css";
import { Editor } from "./components/Tapwrite";
import { AppContextProvider } from "./context";
import { TiptapEditorUtils } from "./utils/tiptapEditorUtils";

export interface NotionLikeProps {
  uploadFn?: (file: File, tiptapEditorUtils: TiptapEditorUtils) => void;
  getContent: (content: string) => void;
  content: string;
  readonly?: boolean;
  className?: string;
  placeholder?: string;
  onFocus?: () => void;
  suggestions?: any;
  isTextInput?: boolean;
<<<<<<< HEAD
  onBlur?: () => void;
=======
  editorClass: string;
>>>>>>> b9ab4840a712f6888ec803d5ec1c132ebb1ea337
}

export const Tapwrite = ({
  uploadFn,
  getContent,
  content,
  readonly,
  className,
  placeholder,
  onFocus,
  isTextInput = false,
  suggestions,
<<<<<<< HEAD
  onBlur,
=======
  editorClass
>>>>>>> b9ab4840a712f6888ec803d5ec1c132ebb1ea337
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
        suggestions={suggestions}
        isTextInput={isTextInput}
<<<<<<< HEAD
        onBlur={onBlur}
=======
        editorClass={editorClass}
>>>>>>> b9ab4840a712f6888ec803d5ec1c132ebb1ea337
      />
    </AppContextProvider>
  );
};

export { TiptapEditorUtils };
