import * as React from 'react'
import { Popper } from '@mui/material'
import { Editor, isNodeSelection, posToDOMRect } from '@tiptap/core'

type Props = {
  editor: Editor
  open: () => boolean
  children: React.ReactNode
  offset: number[]
}

const ControlledBubbleMenu: React.FC<Props> = ({
  editor,
  open,
  children,
  offset,
}: Props) => (
  <Popper
    id='controlled-bubble-menu'
    open={open()}
    placement='top'
    modifiers={[
      {
        name: 'offset',
        options: {
          // Add a slight vertical offset for the popper from the current selection
          offset: offset,
        },
      },
      {
        name: 'flip',
        enabled: true,
        options: {
          boundary: editor.options.element,
          fallbackPlacements: [
            'bottom',
            'top-start',
            'bottom-start',
            'top-end',
            'bottom-end',
          ],
          padding: 8,
        },
      },
    ]}
    sx={{ zIndex: '9999' }}
    anchorEl={() => {
      // The logic here is taken from the positioning implementation in Tiptap's BubbleMenuPlugin
      // https://github.com/ueberdosis/tiptap/blob/16bec4e9d0c99feded855b261edb6e0d3f0bad21/packages/extension-bubble-menu/src/bubble-menu-plugin.ts#L183-L193
      const { ranges } = editor.state.selection
      const from = Math.min(...ranges.map((range) => range.$from.pos))
      const to = Math.max(...ranges.map((range) => range.$to.pos))

      return {
        getBoundingClientRect: () => {
          if (isNodeSelection(editor.state.selection)) {
            const node = editor.view.nodeDOM(from) as HTMLElement

            if (node) {
              return node.getBoundingClientRect()
            }
          }

          return posToDOMRect(editor.view, from, to)
        },
      }
    }}
  >
    {children}
  </Popper>
)

export default ControlledBubbleMenu
