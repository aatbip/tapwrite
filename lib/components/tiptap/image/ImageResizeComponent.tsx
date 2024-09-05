/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resize } from './resizeIcon'

export const ImageResizeComponent = (props: any) => {
  const handler = (
    mouseDownEvent: React.MouseEvent<HTMLImageElement>,
    side: 'left' | 'right' = 'right'
  ) => {
    const parent = (mouseDownEvent.target as HTMLElement).closest(
      '.image-resizer'
    )
    const image = parent?.querySelector('img.postimage') ?? null
    if (image === null) return

    const startSize = { x: image.clientWidth, y: image.clientHeight }
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY }
    function onMouseMove(mouseMoveEvent: MouseEvent) {
      let newWidth: number
      let newHeight: number

      if (side === 'left') {
        newWidth = startSize.x + (startPosition.x - mouseMoveEvent.pageX)
        newHeight = startSize.y
      } else {
        newWidth = startSize.x - startPosition.x + mouseMoveEvent.pageX
        newHeight = startSize.y - startPosition.y + mouseMoveEvent.pageY
      }
      newWidth = Math.max(newWidth, 200)
      newHeight = Math.max(newHeight, 200)

      props.updateAttributes({
        width: newWidth,
        height: newHeight,
      })
    }

    function onMouseUp() {
      document.body.removeEventListener('mousemove', onMouseMove)
    }

    document.body.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseup', onMouseUp, { once: true })
  }

  return (
    <NodeViewWrapper className='image-resizer'>
      {props.node.attrs.id === 'loading' ? (
        <>
          <img {...props.node.attrs} className='postimage' />
          <div className='spinner-overlay'>
            <div className='spinner' />
          </div>
        </>
      ) : (
        <>
          <img {...props.node.attrs} className='postimage' />
          <div
            className='resize-trigger left'
            onMouseDown={(e: React.MouseEvent<HTMLImageElement>) =>
              handler(e, 'left')
            }
          >
            <Resize />
          </div>
          <div className='resize-trigger right' onMouseDown={handler}>
            <Resize />
          </div>
        </>
      )}
    </NodeViewWrapper>
  )
}
