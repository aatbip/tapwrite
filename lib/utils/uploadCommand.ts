import { Editor, Range } from '@tiptap/react'
import { TiptapEditorUtils } from './tiptapEditorUtils'

export const uploadCommand = async ({
  editor,
  range,
}: {
  editor: Editor
  range: Range
}) => {
  const tiptapEditorUtils = new TiptapEditorUtils(editor)
  tiptapEditorUtils.deleteRange(range)

  const fileHolder = document.createElement('input')
  fileHolder.setAttribute('type', 'file')
  fileHolder.setAttribute('accept', '*') // Allows all file types
  fileHolder.style.visibility = 'hidden'
  document.body.appendChild(fileHolder)

  fileHolder.addEventListener('change', async (e) => {
    const target = e.target as HTMLInputElement
    if (target.files?.length) {
      const file = target.files[0]

      tiptapEditorUtils.setAttachment(file)

      editor.view.focus()
    }
    // Clean up the file input
    document.body.removeChild(fileHolder)
  })

  fileHolder.click()
}
