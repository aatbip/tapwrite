import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export const AutofillComponent = () => {
  return (
    <NodeViewWrapper className='pill-extension' as='span'>
      <NodeViewContent as='span' />
    </NodeViewWrapper>
  )
}
