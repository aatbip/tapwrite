import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { AutofillComponent } from './AutofillComponent'

export const AutofillExtension = Node.create({
  name: 'autofillComponent',
  group: 'inline',
  content: 'inline*',
  inline: true,
  selectable: false,
  atom: true,
  parseHTML() {
    return [
      {
        tag: 'autofill',
      },
    ]
  },

  whitespace: 'normal',

  renderHTML({ HTMLAttributes }) {
    return ['autofill', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AutofillComponent)
  },
})
