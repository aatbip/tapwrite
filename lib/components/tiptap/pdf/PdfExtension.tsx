import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Linkpdf } from './Linkpdf'

export default Node.create({
  name: 'linkpdfComponent',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'linkpdf',
      },
    ]
  },

  whitespace: 'normal',

  renderHTML({ HTMLAttributes }) {
    return ['linkpdf', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Linkpdf)
  },
})
