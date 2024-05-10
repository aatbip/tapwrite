import { PdfIcon } from './../../../icons'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export const Linkpdf = () => {
  return (
    <NodeViewWrapper className='flex flex-row items-end'>
      <div className='cursor-pointer'>
        <PdfIcon />
      </div>

      <NodeViewContent as='div' className='content' />
    </NodeViewWrapper>
  )
}
