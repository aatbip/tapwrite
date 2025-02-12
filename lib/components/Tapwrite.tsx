import { EditorContent, useEditor } from '@tiptap/react'
import * as React from 'react'
import { useEffect } from 'react'

import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import CalloutExtension from './tiptap/callout/CalloutExtension'
import LinkpdfExtension from './tiptap/pdf/PdfExtension'
import { TableCell } from './tiptap/table/table-cell'
// import Mentions from "@tiptap/extension-mention";
import { Box, IconButton, Stack } from '@mui/material'
import Hardbreak from '@tiptap/extension-hard-break'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorState } from '@tiptap/pm/state'
import { useAppState } from '../context/useAppState'
import { AttachmentIcon } from '../icons'
import { NotionLikeProps } from '../main'
import { uploadCommand } from '../utils/uploadCommand'
import './../globals.css'
import { UploadAttachment } from './tiptap/attachments/attachmentUpload'
import { AutofillExtension } from './tiptap/autofieldSelector/ext_autofill'
import BubbleMenuContainer from './tiptap/bubbleMenu/BubbleMenu'
import ControlledBubbleMenu from './tiptap/bubbleMenu/ControlledBubbleMenu'
import FloatingCommandExtension from './tiptap/floatingMenu/floatingCommandExtension'
import { floatingMenuSuggestion } from './tiptap/floatingMenu/floatingMenuSuggestion'
import { IframeExtension } from './tiptap/iframe/ext_iframe'
import { UploadImage } from './tiptap/image/imageUpload'
// import suggestion from "../components/tiptap/mention/suggestion.ts";
// import { MentionStorage } from "./tiptap/mention/MentionStorage.extension.ts";
// mention turned off for now

export const Editor = ({
  uploadFn,
  getContent,
  content,
  readonly = false,
  className,
  placeholder,
  onFocus,
  handleImageClick,
  handleImageDoubleClick,
  // suggestions,
  isTextInput,
  editorClass,
  deleteEditorAttachments,
  hardbreak,
  onActiveStatusChange,
  attachmentLayout,
  addAttachmentButton,
  maxUploadLimit,
  parentContainerStyle,
  endButtons,
  editorRef,
}: NotionLikeProps) => {
  const initialEditorContent = placeholder ?? 'Type "/" for commands'

  const isTextInputClassName =
    'p-1.5 px-2.5  focus-within:border-black border-gray-300 bg-white border focus:border-black rounded-100  text-sm resize-y overflow-auto'
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: editorClass ?? '',
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
      History,
      Hardbreak.extend({
        addKeyboardShortcuts() {
          return {
            // Override default Enter key behavior to conditionally prevent line break
            Enter: () => {
              if (
                this.editor?.isActive('bulletList') ||
                this.editor?.isActive('orderedList')
              ) {
                return false
              }
              if (hardbreak) {
                return true
              }

              return false
            },
            // Allow Shift+Enter for line break if hardbreak is true
            'Shift-Enter': () => {
              if (
                this.editor?.isActive('bulletList') ||
                this.editor?.isActive('orderedList')
              ) {
                return this.editor.commands.setHardBreak()
              }
              if (hardbreak) {
                return this.editor.commands.splitBlock() //using splitBlock() to create another node on enter instead of using setHardBreak() which applies <br> on the same node which causes anomaly on options like list and headings.
              }
              return false
            },
          }
        },
      }),
      FloatingCommandExtension.configure({
        suggestion: floatingMenuSuggestion(uploadFn),
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

      UploadImage.configure({
        uploadFn,
        deleteImage: deleteEditorAttachments && deleteEditorAttachments,
        handleImageClick,
        handleImageDoubleClick,
      }),
      UploadAttachment.configure({
        uploadFn,
        deleteAttachment: deleteEditorAttachments && deleteEditorAttachments,
        attachmentLayout: attachmentLayout && attachmentLayout,
        maxUploadLimit: maxUploadLimit && maxUploadLimit,
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

      setTimeout(() => {
        const { state, view } = editor

        // Create a new EditorState without undo/redo history
        // This is necessary because a history is set after setContent command is run. So when cmd+z is operated,
        // it ends up in an empty state.
        const newState = EditorState.create({
          doc: state.doc,
          plugins: state.plugins, // Preserve the plugins
        })

        // Replace the editor state with the new state (without history)
        view.updateState(newState)
      }, 0)
    }
  }, [content, editor])

  const appState = useAppState()

  useEffect(() => {
    if (editor) {
      appState?.setEditor(editor)
      if (uploadFn) {
        appState?.setUploadFn(uploadFn)
      }

      editor.setEditable(!readonly)
    }
  }, [editor, readonly])

  useEffect(() => {
    if (!editor) {
      return
    }
    const updateActiveStatus = () => {
      const isListActive =
        editor.isActive('bulletList') || editor.isActive('orderedList')
      const isFloatingMenuActive =
        editor.storage.floatingCommand?.isActive || false

      const activeStatus = { isListActive, isFloatingMenuActive }

      onActiveStatusChange?.(activeStatus)
    }

    editor.on('transaction', updateActiveStatus)

    updateActiveStatus()

    editor.off('transaction', updateActiveStatus)
  }, [editor, onActiveStatusChange])

  if (!editor) return null

  return (
    <>
      <div
        style={
          parentContainerStyle ?? {
            width: '100%',
            height: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }
        }
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
          onFocus={() => editor.commands.focus('end')}
          tabIndex={0}
          ref={editorRef}
        />
        <Stack
          direction='row'
          columnGap={'12px'}
          sx={{ alignSelf: 'self-end' }}
        >
          {uploadFn && addAttachmentButton && (
            <Box>
              {editor.isEditable && (
                <IconButton
                  sx={{
                    display: editor.isEditable ? 'flex' : 'none',

                    '&:hover': {
                      borderRadius: '4px',
                      background: '#F8F9FB',
                    },
                  }}
                  onClick={() =>
                    uploadCommand({ editor, range: editor.state.selection })
                  }
                >
                  <AttachmentIcon />
                </IconButton>
              )}
            </Box>
          )}
          {endButtons}
        </Stack>
      </div>
    </>
  )
}
