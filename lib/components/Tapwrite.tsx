import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'

import CalloutExtension from './tiptap/callout/CalloutExtension'
import LinkpdfExtension from './tiptap/pdf/PdfExtension'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Text from '@tiptap/extension-text'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Table from '@tiptap/extension-table'
import { TableCell } from './tiptap/table/table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Underline from '@tiptap/extension-underline'
import CodeBlock from '@tiptap/extension-code-block'
import Code from '@tiptap/extension-code'
import Link from '@tiptap/extension-link'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Gapcursor from '@tiptap/extension-gapcursor'
import History from '@tiptap/extension-history'
// import Mentions from "@tiptap/extension-mention";
import Placeholder from '@tiptap/extension-placeholder'
import FloatingCommandExtension from './tiptap/floatingMenu/floatingCommandExtension'
import Hardbreak from '@tiptap/extension-hard-break'
import { floatingMenuSuggestion } from './tiptap/floatingMenu/floatingMenuSuggestion'
import { ImageResize } from './tiptap/image/image'
import ControlledBubbleMenu from './tiptap/bubbleMenu/ControlledBubbleMenu'
import BubbleMenuContainer from './tiptap/bubbleMenu/BubbleMenu'
import { AutofillExtension } from './tiptap/autofieldSelector/ext_autofill'
import { IframeExtension } from './tiptap/iframe/ext_iframe'

import './../globals.css'
import { useAppState } from '../context/useAppState'
import { NotionLikeProps } from '../main'
// import suggestion from "../components/tiptap/mention/suggestion.ts";
// import { MentionStorage } from "./tiptap/mention/MentionStorage.extension.ts";
// mention turned off for now

export const Editor = ({
  uploadFn,
  getContent,
  content,
  readonly,
  className,
  placeholder,
  onFocus,
  // suggestions,
  isTextInput,
  editorClass,

  deleteEditorAttachments,
}: NotionLikeProps) => {
  const initialEditorContent = placeholder ?? 'Type "/" for commands'

  const isTextInputClassName =
    'p-1.5 px-2.5  focus-within:border-black border-gray-300 bg-white border focus:border-black rounded-100  text-sm resize-y overflow-auto'
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: editorClass,
      },
    },
    extensions: [
      AutofillExtension,
      IframeExtension.configure({
        allowFullscreen: true,
      }),
      Document,
      Paragraph,
      Heading,
      Text,
      Underline,
      Bold,
      Italic,
      Strike,
      // MentionStorage,    mention turned off for now
      CalloutExtension,
      LinkpdfExtension,
      Gapcursor,
      History,
      Hardbreak,
      FloatingCommandExtension.configure({
        suggestion: floatingMenuSuggestion,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          const headingPlaceholders: any = {
            1: 'Heading 1',
            2: 'Heading 2',
            3: 'Heading 3',
          }

          if (node.type.name === 'heading') {
            return headingPlaceholders[node.attrs.level]
          }

          return initialEditorContent
        },
      }),
      Link.extend({
        exitable: true,
      }).configure({
        autolink: false,
      }),
      OrderedList.configure({
        itemTypeName: 'listItem',
        keepMarks: true,
        keepAttributes: true,
        HTMLAttributes: {
          class: 'list-decimal',
          type: '1',
        },
      }),
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc',
        },
      }),
      ImageResize.configure({
        deleteImage: deleteEditorAttachments && deleteEditorAttachments,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'font-bold',
        },
      }),
      CodeBlock,
      Code,
      // Mentions.configure({
      //   HTMLAttributes: {
      //     class: "mention",
      //   },
      //   suggestion: {
      //     ...suggestion,
      //     items: ({ query, editor }) => {
      //       const suggestions = editor.storage.MentionStorage.suggestions;
      //       return suggestions.filter((item: any) =>
      //         item.label.toLowerCase().startsWith(query.toLowerCase())
      //       );
      //     },
      //   },
      // }),
      // mention turned off for now
    ],
    content: content,
    onUpdate: ({ editor }) => {
      getContent(editor.getHTML())
    },
    onFocus: () => onFocus && onFocus(),
  })

  // useEffect(() => {
  //   if (editor) {
  //     editor.storage.MentionStorage.suggestions = suggestions;
  //   }
  // }, [suggestions, editor]);
  // mention turned off for now

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const appState = useAppState()

  useEffect(() => {
    if (editor) {
      appState?.setEditor(editor)
      if (uploadFn) {
        appState?.setUploadFn(uploadFn)
      }
      if (readonly) {
        editor.setEditable(false)
      }
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.metaKey && event.key === 'z') {
          event.preventDefault() // Prevent the default behavior of Cmd+Z (e.g., browser undo)
          editor.chain().focus().undo().run() // Perform undo operation
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [editor, uploadFn, readonly])

  if (!editor) return null

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {!readonly && (
          <div>
            <ControlledBubbleMenu
              editor={editor}
              open={() => {
                const { view, state } = editor
                const { from, to } = view.state.selection
                const text = state.doc.textBetween(from, to, '')
                if (text !== '') return true
                return false
              }}
              offset={[0, 10]}
            >
              <BubbleMenuContainer editor={editor} />
            </ControlledBubbleMenu>
          </div>
        )}
        <EditorContent
          editor={editor}
          readOnly={readonly ? true : false}
          className={
            isTextInput ? `${className} ${isTextInputClassName}` : className
          }
          onFocus={() => editor.commands.focus()}
          tabIndex={0}
        />
      </div>
    </>
  )
}
