import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { AttachmentComponent } from './attachmentComponent' // You’ll need to create this component
import { Plugin, TextSelection } from '@tiptap/pm/state'

export const UploadAttachment = Node.create({
  name: 'uploadAttachment',

  onCreate() {
    //leaving this empty because to prevent props being globally overridden.
  },

  addOptions() {
    return {
      inline: false,
      group: 'block',
      HTMLAttributes: {},
      uploadFn: null,
      deleteAttachment: undefined,
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      filename: { default: null },
      filetype: { default: null },
      fileSize: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'a[data-filetype]' }] // Parses <a> tags with a specific attribute as file nodes
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
      HTMLAttributes.filename || 'Download File', // Fallback text if filename is missing
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AttachmentComponent) // Renders the file attachment component
  },

  addCommands() {
    const { deleteAttachment } = this.options
    return {
      addAttachment: (file: File) => () => {
        const view = this.editor.view
        const schema = this.editor.schema
        const uploadFn = this.options.uploadFn
        if (uploadFn && file) {
          handleFileUpload(view, file, schema, uploadFn)
        }
        view.focus()
        return false
      },
      deleteCurrentNode:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)
          if (node && node.type.name === this.name) {
            const attachmentUrl = node.attrs.src
            dispatch &&
              dispatch(
                state.tr.replaceWith(
                  selection.from,
                  selection.to,
                  state.schema.nodes.paragraph.create()
                )
              )

            if (deleteAttachment) {
              deleteAttachment(attachmentUrl)
            }

            return true
          }
          return false
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop: (view, event) => {
              const { uploadFn } = this.options
              if (
                event.dataTransfer &&
                event.dataTransfer.files.length > 0 &&
                uploadFn
              ) {
                event.preventDefault()
                const file = event.dataTransfer.files[0]
                handleFileUpload(view, file, view.state.schema, uploadFn)
                return true
              }
              return false
            },
            paste: (view, event) => {
              const items = event?.clipboardData?.items
              const uploadFn = this.options.uploadFn

              if (items && uploadFn) {
                const fileItem = Array.from(items).find(
                  (item) => item.kind === 'file' && item.getAsFile() !== null
                )
                const file = fileItem ? fileItem.getAsFile() : null
                if (file) {
                  event.preventDefault()
                  handleFileUpload(view, file, view.state.schema, uploadFn)
                  return true
                }
              }
              return false
            },
          },
        },
      }),
    ]
  },
})

function handleFileUpload(
  view: any,
  file: File,
  schema: any,
  uploadFn: ((file: File) => Promise<string | undefined>) | null
) {
  uploadFn?.(file).then(
    async (url: string | undefined) => {
      if (url) {
        const transaction = view.state.tr

        // Insert the attachment node
        transaction.replaceSelectionWith(
          schema.nodes.uploadAttachment.create({
            src: url,
            filename: file.name,
            filetype: file.type,
          })
        )

        const posAfterAttachment = transaction.selection.$anchor.pos + 1

        transaction.insert(posAfterAttachment, schema.nodes.paragraph.create())

        transaction.setSelection(
          TextSelection.near(transaction.doc.resolve(posAfterAttachment + 1))
        )

        // Dispatch the transaction
        view.dispatch(transaction)
      }
    },
    () => {
      // Handle upload failure if needed
    }
  )
}
