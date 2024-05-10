import React, { useCallback, useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resize } from '../image/resizeIcon'
import { debounce } from '@mui/material'

export const EmbedComponent = (props: any) => {
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const parent = event.currentTarget.closest('.embed')
      const image = parent?.querySelector('div.iframe_container')
      if (!image) return

      setIsResizing(true)

      const startSize = { x: image.clientWidth, y: image.clientHeight }
      const startPosition = { x: event.pageX, y: event.pageY }

      const onMouseMove = debounce((mouseMoveEvent: MouseEvent) => {
        props.updateAttributes({
          width: startSize.x - startPosition.x + mouseMoveEvent.pageX,
          height: startSize.y - startPosition.y + mouseMoveEvent.pageY,
        })
      }, 10)

      const onMouseUp = () => {
        setIsResizing(false)
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [],
  )

  function extractIframeSrc(inputString: string) {
    // Regular expression to match the src attribute of an iframe tag
    const iframeSrcRegex = /<iframe.*?src=["']([^"']+)["'][^>]*><\/iframe>/

    const match = inputString.match(iframeSrcRegex)
    if (match) {
      return match[1]
    } else {
      return inputString
    }
  }

  return (
    <NodeViewWrapper className='embed relative'>
      <div
        className='iframe_container'
        style={{
          height: props.node.attrs.height,
          width: props.node.attrs.width,
        }}
      >
        <iframe
          src={extractIframeSrc(props.node.attrs.src)}
          width='100%'
          height='100%'
        />
      </div>
      <div
        className={`resize-trigger${isResizing ? '' : ' !pointer-events-none'} !hover:pointer-events-auto absolute w-full h-full grid place-items-end`}
        onMouseDown={handleMouseDown}
      >
        <Resize />
      </div>
    </NodeViewWrapper>
  )
}
