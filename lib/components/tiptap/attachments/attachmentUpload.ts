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
      attachmentLayout: undefined,
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
      fileName: { default: null },
      fileType: { default: null },
      fileSize: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        // Match div with our custom data attribute
        tag: 'div[data-type="attachment"]',
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) {
            return false
          }

          return {
            src: dom.getAttribute('data-src'),
            fileName: dom.getAttribute('data-filename'),
            fileType: dom.getAttribute('data-filetype'),
            fileSize: dom.getAttribute('data-filesize'),
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // Clean up attributes for HTML rendering
    const { src, fileName, fileType, fileSize } = HTMLAttributes

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'attachment',
        src: src,
        'data-filename': fileName,
        'data-filetype': fileType,
        'data-filesize': fileSize,
      }),
      [
        'attachment-view',
        {
          fileName: fileName,
          fileType: fileType,
          fileSize: fileSize,
          src: src,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        fileName || 'Download File',
      ],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AttachmentComponent)
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
              const { uploadFn } = this.options

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
  uploadFn: ((file: File) => Promise<string | undefined>) | null,
  attachmentLayout?: (props: {
    selected: boolean
    src: string
    fileName: string
    fileSize: string
    fileType: string
  }) => React.ReactNode
) {
  uploadFn?.(file).then(
    async (url: string | undefined) => {
      if (url) {
        const transaction = view.state.tr
        // Insert the attachment node
        transaction.replaceSelectionWith(
          schema.nodes.uploadAttachment.create({
            src: url,
            fileName: file.name,
            fileType: file.type,
            attachmentLayout: attachmentLayout,
            fileSize: file.size,
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
