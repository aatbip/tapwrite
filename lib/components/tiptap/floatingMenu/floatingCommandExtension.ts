import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

const FloatingCommandExtension = Extension.create({
  name: 'floatingMenuCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        //@ts-expect-error uknown properties range and props
        command: ({ editor, range, props }) => {
          props.id.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export default FloatingCommandExtension
