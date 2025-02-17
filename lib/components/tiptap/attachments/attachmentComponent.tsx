import { Editor, NodeViewWrapper } from '@tiptap/react'
import React, { useEffect, useState } from 'react'

interface AttachmentProps {
  node: {
    attrs: {
      src: string
      fileName: string
      fileType: string
      fileSize: string
      isUploading: boolean
    }
  }
  selected: boolean
  extension: {
    options: {
      attachmentLayout?: (props: {
        selected: boolean
        src: string
        fileName: string
        fileSize: string
        fileType: string
        isUploading: boolean
        onDelete: () => void
      }) => React.ReactNode
    }
  }
  editor: Editor
  getPos: () => number
}

export const AttachmentComponent: React.FC<AttachmentProps> = ({
  node,
  selected,
  extension,
  editor,
  getPos,
}) => {
  const { src, fileName, fileType, fileSize, isUploading } = node.attrs
  const { attachmentLayout } = extension.options
  const [isEditable, setIsEditable] = useState(editor.isEditable)
  const [isSelected, setIsSelected] = useState(selected)

  useEffect(() => {
    const updateEditableState = () => {
      setIsEditable(editor.isEditable)
      if (!editor.isEditable) {
        setIsSelected(false)
      } else {
        setIsSelected(selected)
      }
    }
    editor.on('update', updateEditableState)
    return () => {
      editor.off('update', updateEditableState)
    }
  }, [editor])

  const renderIcon = () => {
    // Render an icon based on file type (e.g., PDF icon for PDFs)
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('excel')) return '📊'
    return '📎' // Default icon for unknown file types
  }

  const handleDelete = () => {
    if (typeof getPos === 'function') {
      const pos = getPos()
      editor.commands.setNodeSelection(pos)
      editor.commands.deleteCurrentNode()
    }
  }

  const attachmentProps = {
    selected: isSelected,
    src: src,
    fileName: fileName,
    fileSize: fileSize,
    fileType: fileType,
    isUploading: isUploading,
    onDelete: handleDelete,
    isEditable: isEditable,
  }

  if (isUploading) {
    return (
      <NodeViewWrapper>
        {attachmentLayout ? (
          attachmentLayout(attachmentProps)
        ) : (
          <div className='attachment'>
            <span>{renderIcon()}</span>
            Loading attachment....
          </div>
        )}
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper>
      {attachmentLayout ? (
        attachmentLayout(attachmentProps)
      ) : (
        <div className='attachment'>
          <span>{renderIcon()}</span>
          <a href={src} target='_blank' rel='noopener noreferrer'>
            {fileName || 'Download Attachment'}
          </a>
        </div>
      )}
    </NodeViewWrapper>
  )
}
