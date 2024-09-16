/* eslint-disable */

import { Plugin, Transaction } from '@tiptap/pm/state'
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
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: '100%',
        renderHTML: ({ width }) => ({ width }),
      },
      height: {
        default: 'auto',
        renderHTML: ({ height }) => ({ height }),
      },
      isDraggable: {
        default: true,
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
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
        fileHolder.type = 'file'
        fileHolder.accept = 'image/*'
        fileHolder.style.visibility = 'hidden'
        document.body.appendChild(fileHolder)

        const { view, schema } = this.editor

        fileHolder.addEventListener('change', (e: Event) => {
          const target = e.target as HTMLInputElement
          if (
            view.state.selection.$from.parent.inlineContent &&
            target.files?.length
          ) {
            if (typeof uploadFn !== 'function') {
              console.error('uploadFn should be a function')
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
          if (node?.type.name === this.name) {
            const imageUrl = node.attrs.src
            dispatch?.(
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
          const [, , alt, src, title] = match
          return { src, alt, title }
        },
      }),
    ]
  },

  addProseMirrorPlugins() {
    return [placeholderPlugin]
  },
})

// Placeholder plugin
const placeholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr: Transaction, set: DecorationSet) {
      set = set.map(tr.mapping, tr.doc)

      const action = tr.getMeta(placeholderPlugin)
      if (action?.add) {
        const widget = createPlaceholderWidget()
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

function createPlaceholderWidget(): HTMLElement {
  const widget = document.createElement('div')
  const img = document.createElement('img')
  widget.classList.add('image-uploading')
  img.src = imagePreview ?? ''
  widget.appendChild(img)
  return widget
}

function findPlaceholder(state: any, id: any): number | null {
  const decos = placeholderPlugin.getState(state)
  const found = decos?.find(undefined, undefined, (spec) => spec.id === id)
  return found?.length ? found[0].from : null
}

function startImageUpload(view: any, file: File, schema: any) {
  imagePreview = URL.createObjectURL(file)

  const id = {}
  let tr = view.state.tr

  if (!tr.selection.empty) tr.deleteSelection()

  tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from } })

  const positionAfterImage = tr.selection.from + 1
  if (!view.state.doc.nodeAt(positionAfterImage)) {
    tr.insert(positionAfterImage, schema.nodes.paragraph.create())
  }
  view.dispatch(tr)

  uploadFn?.(file).then(
    async (url: string) => {
      await loadImageInBackground(url)
      const pos = findPlaceholder(view.state, id)

      if (pos == null) return

      view.dispatch(
        view.state.tr
          .replaceWith(pos, pos, schema.nodes.uploadImage.create({ src: url }))
          .setMeta(placeholderPlugin, { remove: { id } })
      )
    },
    () => {
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
