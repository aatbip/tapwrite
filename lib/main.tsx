import * as React from 'react'
import './globals.css'
import { Editor } from "./components/Tapwrite";
import { AppContextProvider } from './context';
import { TiptapEditorUtils } from './utils/tiptapEditorUtils';

export interface NotionLikeProps {
  uploadFn?: (file: File, tiptapEditorUtils: TiptapEditorUtils) => void;
  getContent: (content: string) => void;
  content: string;
  readonly?: boolean;
}

export const Tapwrite = ({ uploadFn, getContent, content, readonly }: NotionLikeProps) => {
  return (
    <AppContextProvider>
      <Editor
        uploadFn={uploadFn}
        getContent={getContent}
        content={content}
        readonly={readonly}
      />
    </AppContextProvider>
  )
}

export { TiptapEditorUtils }
