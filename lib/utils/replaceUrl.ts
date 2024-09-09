import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

export async function replaceUrl(
  state: EditorState,
  view: EditorView,
  refreshUrl: (url: string) => Promise<string>
) {
  const imageNodes: { pos: number; node: any }[] = []
  state.doc.descendants((node, pos) => {
    if (node.type.name === 'img') {
      imageNodes.push({ pos, node })
    }
  })
  let tr = state.tr
  for (const { pos, node } of imageNodes) {
    const currentUrl = node.attrs.src

    if (currentUrl && !isBase64Image(currentUrl)) {
      try {
        const newUrl = await refreshUrl(currentUrl)
        if (newUrl !== currentUrl) {
          tr = tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            src: newUrl,
          })
        }
      } catch (error) {
        console.error(`Loading new image Url failed`, error)
      }
    }
  }
  if (tr.docChanged) {
    view.dispatch(tr)
  }
}

function isBase64Image(url: string) {
  const pattern = /^data:image\/(png|jpeg|jpg|gif);base64,/
  return pattern.test(url)
}
