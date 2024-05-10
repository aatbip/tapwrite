import { Editor, ReactRenderer, Range } from '@tiptap/react'
import tippy from 'tippy.js'

import { FloatingMenu } from './FloatingMenu'
import { TiptapEditorUtils } from './../../../utils/tiptapEditorUtils'

export const floatingMenuSuggestion = {
  items: ({ query }: any) => {
    return [
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
        title: 'Autofill Fields',
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          tiptapEditorUtils.insertContent('{{')
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
      //   title: 'Upload',
      //   command: async ({ editor, range }: { editor: Editor; range: any }) => {
      //     const tiptapEditorUtils = new TiptapEditorUtils(editor)
      //     tiptapEditorUtils.deleteRange(range)
      //     const imagePickerUtils = new ImagePickerUtils()
      //     const file = await imagePickerUtils.selectImageFromLocalDrive()
      //     const token = new URLSearchParams(document.location.search).get(
      //       'token',
      //     )
      //     if (file && token) {
      //       const data = await handleBannerImageUpload(file, token)
      //       if (data.contentType === 'application/pdf') {
      //         tiptapEditorUtils.insertPdf(data.filename, data.url)
      //       } else {
      //         tiptapEditorUtils.setImage(data.url as string)
      //       }
      //     }
      //   },
      // },
      {
        title: 'Table',
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          tiptapEditorUtils.insertTable({ rows: 3, cols: 3 })
        },
      },
      {
        title: 'Callout',
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
          tiptapEditorUtils.insertCallout('')
        },
      },
      {
        title: 'Embed',
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          const tiptapEditorUtils = new TiptapEditorUtils(editor)
          tiptapEditorUtils.deleteRange(range)
        },
      },
    ]
      .filter((item) =>
        item.title
          .toLowerCase()
          .replace(' ', '')
          .startsWith(query.toLowerCase()),
      )
      .slice(0, 12)
  },

  render: () => {
    let component: any
    let popup: any

    return {
      onStart: (props: any) => {
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

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}
