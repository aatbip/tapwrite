import * as React from 'react'
import { Editor } from './components/Tapwrite'
import { AppContextProvider } from './context'
import './globals.css'
import { TiptapEditorUtils } from './utils/tiptapEditorUtils'
import { RefObject } from 'react'

export interface NotionLikeProps {
  uploadFn?: (file: File) => Promise<string | undefined>
  getContent: (content: string) => void
  content: string
  readonly?: boolean
  className?: string
  placeholder?: string
  onFocus?: () => void
  handleImageClick?: (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => unknown
  handleImageDoubleClick?: (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => unknown
  // suggestions?: any
  isTextInput?: boolean
  onBlur?: () => void
  editorClass?: string
  handleEditorAttachments?: (file: File) => Promise<void>
  deleteEditorAttachments?: (id: string) => Promise<void>
  hardbreak?: boolean
  onActiveStatusChange?: ({
    isListActive,
    isFloatingMenuActive,
  }: {
    isListActive: boolean
    isFloatingMenuActive: boolean
  }) => void
  attachmentLayout?: (props: {
    selected: boolean
    src: string
    fileName: string
    fileSize: string
    fileType: string
    isUploading: boolean
    onDelete: () => void
  }) => React.ReactNode
  addAttachmentButton?: boolean
  maxUploadLimit?: number
  parentContainerStyle?: React.CSSProperties
  endButtons?: React.ReactNode
  editorRef?: RefObject<HTMLDivElement>
}

export const Tapwrite = ({
  uploadFn,
  getContent,
  content,
  readonly,
  className,
  placeholder,
  onFocus,
  handleImageClick,
  handleImageDoubleClick,
  isTextInput = false,
  // suggestions,
  onBlur,
  editorClass,
  deleteEditorAttachments,
  hardbreak = false,
  onActiveStatusChange,
  attachmentLayout,
  addAttachmentButton,
  maxUploadLimit,
  parentContainerStyle,
  endButtons,
  editorRef,
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
        handleImageClick={handleImageClick}
        handleImageDoubleClick={handleImageDoubleClick}
        // suggestions={suggestions}
        isTextInput={isTextInput}
        onBlur={onBlur}
        editorClass={editorClass}
        deleteEditorAttachments={deleteEditorAttachments}
        hardbreak={hardbreak}
        onActiveStatusChange={onActiveStatusChange}
        attachmentLayout={attachmentLayout}
        addAttachmentButton={addAttachmentButton}
        maxUploadLimit={maxUploadLimit}
        parentContainerStyle={parentContainerStyle}
        endButtons={endButtons}
        editorRef={editorRef}
      />
    </AppContextProvider>
  )
}

export { TiptapEditorUtils }
