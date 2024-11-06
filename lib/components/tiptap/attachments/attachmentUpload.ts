import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Plugin, TextSelection } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { AttachmentComponent } from './attachmentComponent'

interface UploadAttachmentOptions {
  inline: boolean
  group: string
  HTMLAttributes: Record<string, any>
  uploadFn: ((file: File) => Promise<string | undefined>) | null
  deleteAttachment?: (url: string) => void
  attachmentLayout?: (props: {
    selected: boolean
    src: string
    fileName: string
    fileSize: string
    fileType: string
    isUploading: boolean
  }) => React.ReactNode
}

interface AttachmentAttributes {
  src: string | null
  fileName: string | null
  fileType: string | null
  fileSize: number | null
  isUploading: boolean
  uploadId: string | null
}

export const UploadAttachment = Node.create<UploadAttachmentOptions>({
  name: 'uploadAttachment',

  onCreate() {
    // Empty to prevent props being globally overridden
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

  addAttributes(): Record<keyof AttachmentAttributes, any> {
    return {
      src: { default: null },
      fileName: { default: null },
      fileType: { default: null },
      fileSize: { default: null },
      isUploading: { default: false },
      uploadId: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="attachment"]',
        getAttrs: (dom): false | AttachmentAttributes => {
          if (!(dom instanceof HTMLElement)) {
            return false
          }

          return {
            src: dom.getAttribute('data-src'),
            fileName: dom.getAttribute('data-filename'),
            fileType: dom.getAttribute('data-filetype'),
            fileSize: dom.getAttribute('data-filesize')
              ? Number(dom.getAttribute('data-filesize'))
              : null,
            isUploading: dom.getAttribute('data-loading') === 'true',
            uploadId: dom.getAttribute('data-upload-id'),
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, fileName, fileType, fileSize, isUploading, uploadId } =
      HTMLAttributes as AttachmentAttributes

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'attachment',
        'data-src': src,
        'data-filename': fileName,
        'data-filetype': fileType,
        'data-filesize': fileSize,
        'data-loading': isUploading,
        'data-upload-id': uploadId,
      }),
      [
        'attachment-view',
        {
          fileName,
          fileType,
          fileSize,
          src,
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
    return {
      addAttachment:
        (file: File) =>
        ({ tr, dispatch }: { tr: any; dispatch: any }) => {
          if (!dispatch || !this.options.uploadFn) return false

          const uploadId = Math.random().toString(36).substring(2, 9)

          // Create the loading node
          const loadingNode = this.type.create({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            isUploading: true,
            uploadId,
          })

          // Insert at current selection
          tr.replaceSelectionWith(loadingNode)
          tr.setMeta('addToHistory', false)

          // Ensure there's a paragraph after the attachment
          const pos = tr.selection.from
          if (!tr.doc.nodeAt(pos + loadingNode.nodeSize)?.isTextblock) {
            const paragraphNode = this.editor.schema.nodes.paragraph.create()
            tr.insert(pos + loadingNode.nodeSize, paragraphNode)
          }

          // Set cursor after the paragraph to allow user to continue typing
          const nextPos = pos + loadingNode.nodeSize + 1
          tr.setSelection(TextSelection.create(tr.doc, nextPos))
          tr.setMeta('addToHistory', true)
          dispatch(tr)

          // Handle the upload
          this.options
            .uploadFn(file)
            .then((url) => {
              if (url) {
                this.editor.commands.command(({ tr, dispatch }) => {
                  if (!dispatch) return false

                  let uploadNodePos = -1
                  tr.doc.descendants((node, pos) => {
                    if (
                      node.type.name === this.name &&
                      node.attrs.uploadId === uploadId
                    ) {
                      uploadNodePos = pos
                      return false
                    }
                  })

                  if (uploadNodePos > -1) {
                    const updatedNode = this.type.create({
                      src: url,
                      fileName: file.name,
                      fileType: file.type,
                      fileSize: file.size,
                      isUploading: false,
                      uploadId,
                    })
                    tr.replaceWith(
                      uploadNodePos,
                      uploadNodePos + 1,
                      updatedNode
                    )
                    tr.setMeta('addToHistory', false)
                    dispatch(tr)
                  }

                  return true
                })
              }
            })
            .catch((error) => {
              console.error('Upload failed:', error)
              this.editor.commands.command(({ tr, dispatch }) => {
                if (!dispatch) return false

                let uploadNodePos = -1
                tr.doc.descendants((node, pos) => {
                  if (
                    node.type.name === this.name &&
                    node.attrs.uploadId === uploadId
                  ) {
                    uploadNodePos = pos
                    return false
                  }
                })

                if (uploadNodePos > -1) {
                  tr.delete(uploadNodePos, uploadNodePos + 1)
                  dispatch(tr)
                }

                return true
              })
            })

          return true
        },

      deleteCurrentNode:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)

          if (!node || node.type.name !== this.name) return false

          const attachmentUrl = node.attrs.src as string | undefined

          if (dispatch) {
            const tr = state.tr.delete(selection.from, selection.to + 1)
            dispatch(tr)
          }

          if (attachmentUrl && this.options.deleteAttachment) {
            this.options.deleteAttachment(attachmentUrl)
          }

          return true
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop: (view: EditorView, event: DragEvent) => {
              if (!event.dataTransfer?.files.length || !this.options.uploadFn) {
                return false
              }

              event.preventDefault()
              const file = event.dataTransfer.files[0]
              const { state } = view
              const { tr } = state
              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })?.pos

              if (typeof pos === 'number') {
                tr.setSelection(TextSelection.create(tr.doc, pos))
                view.dispatch(tr)
              }
              //@ts-expect-error addAttachment() is a method
              this.editor.chain().focus().addAttachment(file).run()
              return true
            },

            paste: (_view: EditorView, event: ClipboardEvent) => {
              const items = event.clipboardData?.items
              if (!items || !this.options.uploadFn) return false

              const fileItem = Array.from(items).find(
                (item) => item.kind === 'file' && item.getAsFile()
              )
              const file = fileItem?.getAsFile()

              if (!file) return false

              event.preventDefault()
              //@ts-expect-error addAttachment() is a method
              this.editor.chain().focus().addAttachment(file).run()
              return true
            },
          },
        },
      }),
    ]
  },
})
