import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Callout } from './Callout'

export default Node.create({
  name: 'calloutComponent',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'callout',
      },
    ]
  },

  whitespace: 'normal',

  renderHTML({ HTMLAttributes }) {
    return ['callout', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Callout)
  },
})
