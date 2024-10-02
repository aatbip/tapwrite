/* eslint-disable */
import { Plugin, TextSelection, Transaction } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageResizeComponent } from './ImageResizeComponent'
export const inputRegex =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/
let imagePreview: string | null = null
let uploadFn: ((file: File) => Promise<string>) | null = null
interface UploadImageOptions {
  inline: boolean
  HTMLAttributes: Record<string, any>
  uploadFn: ((file: File) => Promise<string>) | null
  deleteImage?: (id: string) => Promise<void>
}
export const UploadImage = Node.create<UploadImageOptions>({
  name: 'uploadImage',
  onCreate() {
    uploadFn = this.options.uploadFn
  },
  addOptions() {
    return {
      inline: false,
      group: 'block',
      draggable: 'true',
      HTMLAttributes: {},
      uploadFn: null,
      deleteImage: undefined,
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
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
        renderHTML: (attributes: Record<string, any>) => {
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: 'auto',
        renderHTML: (attributes: Record<string, any>) => {
          return {
            height: attributes.height,
          }
        },
      },
      isDraggable: {
        default: true,
        renderHTML: () => {
          return {}
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeComponent)
  },
  addCommands() {
    const { deleteImage } = this.options
    return {
      addImage: () => () => {
        const fileHolder = document.createElement('input')
        fileHolder.setAttribute('type', 'file')
        fileHolder.setAttribute('accept', 'image/*')
        fileHolder.setAttribute('style', 'visibility:hidden')
        document.body.appendChild(fileHolder)
        const view = this.editor.view
        const schema = this.editor.schema
        fileHolder.addEventListener('change', (e: Event) => {
          const target = e.target as HTMLInputElement
          if (
            view.state.selection.$from.parent.inlineContent &&
            target.files?.length
          ) {
            if (typeof uploadFn !== 'function') {
              console.log('uploadFn should be a function')
              return
            }
            startImageUpload(view, target.files[0], schema)
            view.focus()
          }
        })
        fileHolder.click()
      },
      deleteCurrentNode:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)
          if (node && node.type.name === this.name) {
            const imageUrl = node.attrs.src
            dispatch &&
              dispatch(
                state.tr.replaceWith(
                  selection.from,
                  selection.to,
                  state.schema.nodes.paragraph.create()
                )
              )

            if (deleteImage) {
              deleteImage(imageUrl)
            }

            return true
          }
          return false
        },
    }
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title, height, width, isDraggable] = match
          return { src, alt, title, height, width, isDraggable }
        },
      }),
    ]
  },
  addProseMirrorPlugins() {
    return [placeholderPlugin]
  },
})
// Plugin for placeholder
const placeholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr: Transaction, set: DecorationSet) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc)
      const action = tr.getMeta(placeholderPlugin)
      if (action?.add) {
        const widget = document.createElement('div')
        const img = document.createElement('img')
        widget.classList.add('image-uploading')
        img.src = imagePreview ?? ''
        widget.appendChild(img)
        const deco = Decoration.widget(action.add.pos, widget, {
          id: action.add.id,
        })
        set = set.add(tr.doc, [deco])
      } else if (action?.remove) {
        set = set.remove(
          set.find(undefined, undefined, (spec) => spec.id === action.remove.id)
        )
      }
      return set
    },
  },
  props: {
    decorations(state) {
      return this.getState(state)
    },
  },
})
// Find the placeholder in the editor
function findPlaceholder(state: any, id: any): number | null {
  const decos = placeholderPlugin.getState(state)
  const found =
    decos && decos.find(undefined, undefined, (spec) => spec.id === id)
  return found && found.length ? found[0].from : null
}
function startImageUpload(view: any, file: File, schema: any) {
  imagePreview = URL.createObjectURL(file)
  // A fresh object to act as the ID for this upload
  const id = {}
  // Replace the selection with a placeholder
  let tr = view.state.tr

  if (!tr.selection.empty) tr.deleteSelection()
  const paragraphNode = schema.nodes.paragraph.create()
  tr = tr.insert(tr.selection.from, paragraphNode)

  tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from } })
  tr = tr.setSelection(
    TextSelection.near(tr.doc.resolve(tr.selection.from + 1))
  )

  view.dispatch(tr)

  //logic to scroll back to the latest node below the images' placeholder
  setTimeout(() => {
    const { node } = view.domAtPos(view.state.selection.anchor)
    if (node) {
      ;(node as HTMLElement).scrollIntoView({
        behavior: 'smooth', // Smooth scrolling for better UX
        block: 'nearest', // Scroll to the nearest position
        inline: 'start',
      })
    }
  }, 0)
  uploadFn?.(file).then(
    async (url: string) => {
      await loadImageInBackground(url)

      const pos = findPlaceholder(view.state, id)

      if (pos == null) return
      const paragraphNode = schema.nodes.paragraph.create()
      // If the content around the placeholder has been deleted, drop the image

      // Insert the uploaded image at the placeholder's position
      view.dispatch(
        view.state.tr
          .replaceWith(
            pos,
            pos + 1,
            schema.nodes.uploadImage.create({ src: url }),
            paragraphNode
          )
          .setMeta(placeholderPlugin, { remove: { id } })
      )

      //logic to scroll back to the latest node below the images
      setTimeout(() => {
        const { node } = view.domAtPos(view.state.selection.anchor)
        if (node) {
          ;(node as HTMLElement).scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start',
          })
        }
      }, 0)
    },
    () => {
      // On failure, clean up the placeholder
      view.dispatch(tr.setMeta(placeholderPlugin, { remove: { id } }))
    }
  )
}
function loadImageInBackground(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}
