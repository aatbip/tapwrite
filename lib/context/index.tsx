import * as React from 'react'
import { Editor } from '@tiptap/react'
import { FC, ReactNode, useState, createContext } from 'react'
import { TiptapEditorUtils } from '../utils/tiptapEditorUtils';

export interface IAppState {
  editor: Editor | null
  uploadFn: ((file: File, tiptapEditorUtils: TiptapEditorUtils) => void) | undefined;
}

export interface IAppContext {
  editor: Editor | null
  uploadFn: ((file: File, tiptapEditorUtils: TiptapEditorUtils) => void) | undefined;
  setEditor: (editor: Editor | null) => void
  setUploadFn: (uploadFn: (file: File, tiptapEditorUtils: TiptapEditorUtils) => void) => void
}

interface IAppCoreProvider {
  children: ReactNode
}

export const AppContext = createContext<IAppContext | null>(null)

export const AppContextProvider: FC<IAppCoreProvider> = ({ children }) => {
  const [state, setState] = useState<IAppState>({
    editor: null,
    uploadFn: undefined
  })

  const setEditor = (editor: Editor | null) => {
    setState((prev) => ({ ...prev, editor: editor }))
  }

  const setUploadFn = (uploadFn: (file: File, tiptapEditorUtils: TiptapEditorUtils) => void) => {
    setState((prev) => ({ ...prev, uploadFn }))
  }

  return (
    <AppContext.Provider
      value={{
        editor: state.editor,
        uploadFn: state.uploadFn,
        setEditor,
        setUploadFn
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

