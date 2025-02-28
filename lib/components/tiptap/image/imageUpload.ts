import { Node, mergeAttributes } from '@tiptap/core'
import {
  Plugin,
  PluginKey,
  Transaction,
  EditorState,
  TextSelection,
} from '@tiptap/pm/state'
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view'
import { ReactNodeViewRenderer, Editor } from '@tiptap/react'
import { ImageResizeComponent } from './ImageResizeComponent'

const uploadKey = new PluginKey('upload-image')

interface UploadAction {
  add?: {
    id: Record<string, never>
    pos: number
    src?: string
  }
  remove?: {
    id: Record<string, never>
  }
}

export interface CustomImageOptions {
  inline: boolean
  HTMLAttributes: Record<string, any>
  uploadFn: ((file: File) => Promise<string | undefined>) | null
  deleteImage?: (id: string) => Promise<void>
  handleImageClick?: (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => unknown
  handleImageDoubleClick?: (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => unknown
}

function findPlaceholder(
  state: EditorState,
  id: Record<string, never>
): number | null {
  const decos = uploadKey.getState(state) as DecorationSet
  const found = decos.find(undefined, undefined, (spec) => spec.id === id)
  return found.length ? found[0].from : null
}

function loadImageInBackground(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

const createPlaceholderPlugin = () => {
  return new Plugin({
    key: uploadKey,
    state: {
      init(): DecorationSet {
        return DecorationSet.empty
      },
      apply(tr: Transaction, set: DecorationSet): DecorationSet {
        set = set.map(tr.mapping, tr.doc)

        const action = tr.getMeta(uploadKey) as UploadAction | undefined

        if (action?.add) {
          const { id, pos, src } = action.add
          if (pos >= tr.doc.content.size) return set

          const placeholder = document.createElement('div')
          placeholder.setAttribute('class', 'image-uploading')

          if (src) {
            const image = document.createElement('img')
            image.setAttribute('class', 'imageClass')
            image.src = src
            placeholder.appendChild(image)
          }

          const deco = Decoration.widget(pos, placeholder, { id })
          set = set.add(tr.doc, [deco])
        } else if (action?.remove) {
          set = set.remove(
            set.find(
              undefined,
              undefined,
              (spec) => spec.id === action.remove?.id
            )
          )
        }

        return set
      },
    },
    props: {
      decorations(state: EditorState) {
        return this.getState(state)
      },
    },
  })
}

export const UploadImage = Node.create<CustomImageOptions>({
  name: 'uploadImage',

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
      uploadFn: null,
      deleteImage: undefined,
      imageClass: 'editor-image',
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: false,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: '100%',
        renderHTML: (attributes: Record<string, any>) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: 'auto',
        renderHTML: (attributes: Record<string, any>) => ({
          height: attributes.height,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  // Connect your custom React component
  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeComponent)
  },

  addCommands() {
    return {
      addImage:
        (file: File) =>
        ({
          tr,
          dispatch,
          state,
          editor,
        }: {
          tr: Transaction
          dispatch: ((tr: Transaction) => void) | undefined
          state: EditorState
          editor: Editor
        }) => {
          if (!dispatch || !file) return false
          const uploadFn = this.options.uploadFn

          if (!uploadFn) return false
          const { schema } = editor

          const id = {} as Record<string, never>

          const previewUrl = URL.createObjectURL(file)

          let transaction = tr
          if (!transaction.selection.empty) {
            transaction = transaction.deleteSelection()
          }

          const paragraphNode = editor.schema.nodes.paragraph.create()
          transaction = transaction.insert(
            transaction.selection.from,
            paragraphNode
          )

          transaction = transaction.setMeta(uploadKey, {
            add: {
              id,
              pos: transaction.selection.from,
              src: previewUrl,
            },
          })

          dispatch(transaction)

          // Handle the upload
          uploadFn(file).then(
            async (url: string | undefined) => {
              if (url) {
                // Preload image
                await loadImageInBackground(url)

                // Find the placeholder position
                const pos = findPlaceholder(editor.state, id)
                if (pos == null) return

                // Create image node
                const imageNode = schema.nodes.uploadImage.create({ src: url })

                // Replace placeholder with actual image
                const finalTr = editor.state.tr
                  .replaceWith(pos, pos, imageNode)
                  .setMeta(uploadKey, { remove: { id } })

                editor.view.dispatch(finalTr)
              }
            },
            (error: Error) => {
              // Clean up on error
              const cleanupTr = editor.state.tr.setMeta(uploadKey, {
                remove: { id },
              })

              editor.view.dispatch(cleanupTr)
              console.error('Image upload failed', error)
            }
          )

          return true
        },
      deleteCurrentNode:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state

          if (
            !selection ||
            selection.from < 0 ||
            selection.from >= state.doc.content.size
          ) {
            return false
          }

          const node = state.doc.nodeAt(selection.from)

          if (
            !node ||
            (node.type.name !== this.name &&
              node.type.name !== 'uploadAttachment')
          ) {
            return false
          }

          const imageUrl = node.attrs.src
          const tr = state.tr
            .replaceWith(
              selection.from,
              selection.from + node.nodeSize,
              state.schema.nodes.paragraph.create()
            )
            .setSelection(TextSelection.near(state.doc.resolve(selection.from)))

          if (dispatch) {
            dispatch(tr)
          }

          if (this.options.deleteImage && imageUrl) {
            this.options.deleteImage(imageUrl).catch((err) => {
              console.error('Failed to delete image:', err)
            })
          }
          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state

        if (!selection || selection.empty) {
          return false
        }

        const docSize = editor.state.doc.content.size
        if (selection.from < 0 || selection.from >= docSize) {
          return false
        }

        try {
          const node = editor.state.doc.nodeAt(selection.from)

          if (
            !node ||
            (node.type.name !== this.name && node.type.name !== 'uploadImage')
          ) {
            return false
          }

          return editor.commands.deleteCurrentNode()
        } catch (error) {
          console.error('Error handling Backspace:', error)
          return false
        }
      },
      Delete: ({ editor }) => {
        const { selection } = editor.state

        if (!selection || selection.empty) {
          return false
        }

        const docSize = editor.state.doc.content.size
        if (selection.from < 0 || selection.from >= docSize) {
          return false
        }

        try {
          const node = editor.state.doc.nodeAt(selection.from)

          if (
            !node ||
            (node.type.name !== this.name && node.type.name !== 'uploadImage')
          ) {
            return false
          }

          return editor.commands.deleteCurrentNode()
        } catch (error) {
          console.error('Error handling Delete:', error)
          return false
        }
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      createPlaceholderPlugin(),
      new Plugin({
        props: {
          handleDOMEvents: {
            drop: (view: EditorView, event: DragEvent) => {
              const { uploadFn } = this.options

              if (!uploadFn || !event.dataTransfer?.files.length) {
                return false
              }

              const images = Array.from(event.dataTransfer.files).filter(
                (file) => /image/i.test(file.type)
              )

              if (images.length === 0) return false

              event.preventDefault()

              // Get coordinates
              const coords = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })

              if (!coords) return false

              const tr = view.state.tr.setSelection(
                (view.state.selection.constructor as any).near(
                  view.state.doc.resolve(coords.pos)
                )
              )
              view.dispatch(tr)

              //@ts-expect-error addImage() is a method
              this.editor.commands.addImage(images[0])

              return true
            },

            // Handle paste
            paste: (view: EditorView, event: ClipboardEvent) => {
              const items = event?.clipboardData?.items
              const { uploadFn } = this.options

              if (!items || !uploadFn) return false

              const images: File[] = []
              for (let i = 0; i < items.length; i++) {
                const item = items[i]
                if (item.type.startsWith('image')) {
                  const file = item.getAsFile()
                  if (file) images.push(file)
                }
              }

              if (images.length === 0) return false

              event.preventDefault()

              // Execute the addImage command with the file
              //@ts-expect-error addImage() is a method
              this.editor.commands.addImage(images[0])

              return true
            },
          },
        },
      }),
    ]
  },
})
