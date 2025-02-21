import { Editor, ReactRenderer, Range } from '@tiptap/react'
import tippy from 'tippy.js'

import { FloatingMenu } from './FloatingMenu'
import { TiptapEditorUtils } from './../../../utils/tiptapEditorUtils'

export const floatingMenuSuggestion = (
  uploadFn?: (file: File) => Promise<string | undefined> | undefined
) => ({
  items: ({ query }: any) => {
    const normalizedQuery = query.toLowerCase().replace(' ', '')
    const items = [
      {
        title: 'Heading 1',
        command: ({ editor, range }: any) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          tiptapEditorUtils.toggleHeading(1)
        },
      },
      {
        title: 'Heading 2',
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          tiptapEditorUtils.toggleHeading(2)
        },
      },
      {
        title: 'Heading 3',
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          tiptapEditorUtils.toggleHeading(3)
        },
      },
      {
        title: 'Text',
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          tiptapEditorUtils.setParagraph()
        },
      },
      {
        title: 'Bullet List',
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          tiptapEditorUtils.toggleBulletList()
        },
      },
      {
        title: 'Numbered List',
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          tiptapEditorUtils.toggleNumberedList()
        },
      },
      // {
      //   title: 'Table',
      //   command: ({ editor, range }: { editor: Editor; range: any }) => {
      //     const tiptapEditorUtils = new TiptapEditorUtils(editor)s
      //     tiptapEditorUtils.deleteRange(range)
      //     tiptapEditorUtils.insertTable({ rows: 3, cols: 3 })
      //   },
      // },
      // {
      //   title: 'Callout',
      //   command: ({ editor, range }: { editor: Editor; range: any }) => {
      //     const tiptapEditorUtils = new TiptapEditorUtils(editor)
      //     tiptapEditorUtils.deleteRange(range)
      //     tiptapEditorUtils.insertCallout('')
      //   },
      // },
    ]

    // Conditionally add the "Upload" option if uploadFn is provided
    if (uploadFn) {
      items.push({
        title: 'Upload',
        command: async ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)

          const fileHolder = document.createElement('input')
          fileHolder.setAttribute('type', 'file')
          fileHolder.setAttribute('accept', '*') // Allows all file types
          fileHolder.setAttribute('style', 'visibility:hidden')
          document.body.appendChild(fileHolder)
          fileHolder.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement
            if (target.files?.length) {
              const file = target.files[0]
              tiptapEditorUtils.setAttachment(file) // show everything as attachments from upload menu suggestion
              editor.commands.focus()
            }
          })

          fileHolder.click()
        },
      })
      items.push({
        title: 'Image',
        command: async ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          const fileHolder = document.createElement('input')
          fileHolder.setAttribute('type', 'file')
          fileHolder.setAttribute('accept', 'image/*')
          fileHolder.setAttribute('style', 'visibility:hidden')
          document.body.appendChild(fileHolder)
          fileHolder.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement
            if (target.files?.length) {
              const file = target.files[0]
              tiptapEditorUtils.setImage(file)
              editor.commands.focus()
            }
          })

          fileHolder.click()
        },
      })
    }

    return items
      .filter((item) => {
        if (item.title.startsWith('Heading')) {
          const level = item.title.split(' ')[1]
          return (
            item.title
              .toLowerCase()
              .replace(' ', '')
              .startsWith(normalizedQuery) ||
            `h${level}`.startsWith(normalizedQuery)
          )
        }
        return item.title
          .toLowerCase()
          .replace(' ', '')
          .startsWith(normalizedQuery)
      })
      .slice(0, 12)
  },

  render: () => {
    let component: any
    let popup: any

    return {
      onStart: (props: any) => {
        props.editor.storage.floatingCommand = {
          ...props.editor.storage.floatingCommand,
          isActive: true,
        }
        props.editor.emit('floatingCommandUpdate')
        component = new ReactRenderer(FloatingMenu, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'auto-start',
          offset: [0, 5],
          popperOptions: {
            strategy: 'fixed',
            modifiers: [
              {
                name: 'flip',
                options: {
                  allowedAutoPlacements: ['top-start', 'bottom-start'],
                  fallbackPlacements: ['top-start', 'bottom-start'],
                },
              },
            ],
          },
        })
      },

      onUpdate(props: any) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          props.editor.storage.floatingCommand = {
            ...props.editor.storage.floatingCommand,
            isActive: false,
          }
          props.editor.emit('floatingCommandUpdate')

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit(props: any) {
        props.editor.storage.floatingCommand = {
          ...props.editor.storage.floatingCommand,
          isActive: false,
        }

        // Emit custom event for state change
        props.editor.emit('floatingCommandUpdate')
        popup[0].destroy()
        component.destroy()
      },
    }
  },
})
