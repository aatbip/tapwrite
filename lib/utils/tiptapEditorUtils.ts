import { Editor, Range } from '@tiptap/react'
import { Level } from '@tiptap/extension-heading'

export class TiptapEditorUtils {
  editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
  }

  clearCurrentLineContent() {
    const { tr, doc } = this.editor.state
    const { from, to } = this.editor.view.state.selection

    const $from = doc.resolve(from)
    const $to = doc.resolve(to)

    // Get the start and end positions of the current line
    const startOfLine = $from.start()
    const endOfLine = $to.end()

    // Get the last text node in the current line
    let lastTextNodePos = null
    doc.nodesBetween(startOfLine, endOfLine, (node, pos) => {
      if (node.isText) {
        lastTextNodePos = pos
      }
    })

    // Check if the last character of the last text node is "/"
    if (lastTextNodePos !== null) {
      const lastTextNode = doc.nodeAt(lastTextNodePos)
      if (!lastTextNode) return

      const lastText = lastTextNode.text

      if (!lastText) return

      if (lastText.endsWith('/')) {
        const deletePos = lastTextNodePos + lastText.length - 1
        tr.delete(deletePos, deletePos + 1) // Delete the last character
      }

      if (lastText.endsWith('{')) {
        const deletePos = lastTextNodePos + lastText.length - 2
        tr.delete(deletePos, deletePos + 2) // Delete the last character
      }
    }

    // Apply the transaction to the editor
    this.editor.view.dispatch(tr)
  }

  deleteRange(range: Range) {
    this.editor.chain().focus().deleteRange(range).run()
  }

  toggleHeading(level: Level) {
    this.editor.chain().focus().toggleHeading({ level: level }).run()
  }

  setParagraph() {
    this.editor.chain().focus().setParagraph().run()
  }

  toggleBulletList() {
    this.editor.chain().focus().toggleBulletList().run()
  }

  toggleNumberedList() {
    this.editor.chain().focus().toggleOrderedList().run()
  }

  toggleBold() {
    this.editor.chain().focus().toggleBold().run()
  }

  toggleItalic() {
    this.editor.chain().focus().toggleItalic().run()
  }

  toggleUnderline() {
    this.editor.chain().focus().toggleUnderline().run()
  }

  toggleStrike() {
    this.editor.chain().focus().toggleStrike().run()
  }

  insertCodeBlock() {
    this.editor.chain().focus().toggleCode().run()
  }

  insertLink(url: string) {
    this.editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }

  unlink() {
    this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
  }

  setImage(imgUrl: string) {
    this.editor.chain().focus().setImage({ src: imgUrl }).run()
  }

  insertTable({ rows, cols }: { rows: number; cols: number }) {
    this.editor
      .chain()
      .focus()
      .insertTable({ rows: rows, cols: cols, withHeaderRow: true })
      .run()
  }

  insertCallout(text: string) {
    this.editor
      .chain()
      .focus()
      .insertContent(`<callout>${text}</callout>`)
      .run()
  }

  insertPdf(text: string, url: string) {
    this.editor
      .chain()
      .focus()
      .insertContent(`<linkpdf><a href=${url}>${text}</a></linkpdf>`)
      .run()
  }

  insertContent(content: string) {
    this.editor
      .chain()
      .focus()
      .setParagraph()
      .insertContent(content.toString())
      .run()
  }

  insertAutofill(content: string) {
    this.editor
      .chain()
      .focus()
      .insertContent(`<autofill>${content}</autofill> `)
      .run()
  }

  insertEmbed(url: string) {
    this.editor.chain().focus().setIframe({ src: url }).run()
  }

  getSelectedText() {
    const { view, state } = this.editor
    const { from, to } = view.state.selection
    const text = state.doc.textBetween(from, to, ' ')
    return text
  }
}

