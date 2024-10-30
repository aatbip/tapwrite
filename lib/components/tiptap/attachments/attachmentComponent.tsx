import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'

interface AttachmentProps {
  node: {
    attrs: {
      src: string
      filename: string
      filetype: string
    }
  }
}

export const AttachmentComponent: React.FC<AttachmentProps> = ({ node }) => {
  const { src, filename, filetype } = node.attrs
  console.log(node.attrs)

  console.log('trigger')
  const renderIcon = () => {
    // Render an icon based on file type (e.g., PDF icon for PDFs)
    if (filetype.includes('pdf')) return '📄'
    if (filetype.includes('word')) return '📝'
    if (filetype.includes('excel')) return '📊'
    return '📎' // Default icon for unknown file types
  }

  return (
    <NodeViewWrapper>
      <div className='attachment'>
        <span>{renderIcon()}</span>
        <a href={src} target='_blank' rel='noopener noreferrer'>
          {filename || 'Download Attachment'}
        </a>
      </div>
    </NodeViewWrapper>
  )
}
