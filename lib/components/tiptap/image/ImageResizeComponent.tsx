import React, { useState, useCallback, useEffect, useRef } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resize } from './resizeIcon'
import { LoadingPlaceholder } from './loadingPlaceholder'

export const ImageResizeComponent = (props: any) => {
  const [loading, setLoading] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [proseMirrorContainerWidth, setProseMirrorContainerWidth] = useState(0)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const resizeRef = useRef<{
    active: boolean
    startX: number
    startWidth: number
  }>({
    active: false,
    startX: 0,
    startWidth: 0,
  })

  useEffect(() => {
    const proseMirrorContainerDiv = document.querySelector('.ProseMirror')
    if (proseMirrorContainerDiv) {
      setProseMirrorContainerWidth(proseMirrorContainerDiv.clientWidth)
    }
  }, [])

  const handleImageLoad = useCallback(() => {
    setLoading(false)
    if (imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight
      setAspectRatio(naturalWidth / naturalHeight)
    }
  }, [])

  const limitMinSize = (width: number, height: number) => {
    const minSize = 200
    return {
      width: Math.max(width, minSize),
      height: Math.max(height, minSize),
    }
  }

  const updateSize = useCallback(
    (newWidth: number) => {
      const newHeight = newWidth / aspectRatio
      const { width, height } = limitMinSize(newWidth, newHeight)

      try {
        if (props.node && props.node.type.name === 'uploadImage') {
          props.updateAttributes({ width, height })
        } else {
          console.warn('Node type mismatch or node not found')
        }
      } catch (error) {
        console.error('Error updating image size:', error)
      }
    },
    [aspectRatio, props]
  )

  const handleResizeStart = useCallback(
    (event: React.PointerEvent, direction: 'left' | 'right') => {
      event.preventDefault()
      event.stopPropagation()

      if (imageRef.current) {
        resizeRef.current = {
          active: true,
          startX: event.clientX,
          startWidth: imageRef.current.clientWidth,
        }

        const handleResizeMove = (moveEvent: PointerEvent) => {
          if (!resizeRef.current.active) return

          moveEvent.preventDefault()
          moveEvent.stopPropagation()

          const diffX = moveEvent.clientX - resizeRef.current.startX
          const newWidth =
            direction === 'right'
              ? resizeRef.current.startWidth + diffX
              : resizeRef.current.startWidth - diffX

          updateSize(
            Math.min(Math.max(newWidth, 200), proseMirrorContainerWidth)
          )
        }

        const handleResizeEnd = () => {
          resizeRef.current.active = false
          window.removeEventListener('pointermove', handleResizeMove)
          window.removeEventListener('pointerup', handleResizeEnd)
          window.removeEventListener('pointercancel', handleResizeEnd)
        }

        window.addEventListener('pointermove', handleResizeMove, {
          passive: false,
        })
        window.addEventListener('pointerup', handleResizeEnd)
        window.addEventListener('pointercancel', handleResizeEnd)
      }
    },
    [proseMirrorContainerWidth, updateSize]
  )

  return (
    <NodeViewWrapper
      className='image-resizer'
      style={{
        outline: props.selected ? '3px solid #0C41BB' : 'none',
        borderColor: props.selected ? '#625df580' : 'none',
        borderRadius: '5px',
      }}
    >
      {loading && <LoadingPlaceholder />}
      <div style={{ display: loading ? 'none' : 'block' }}>
        <div
          className='resize-trigger left'
          onPointerDown={(e) => handleResizeStart(e, 'left')}
          style={{ touchAction: 'none' }}
        >
          <Resize />
        </div>
        <div
          className='resize-trigger right'
          onPointerDown={(e) => handleResizeStart(e, 'right')}
          style={{ touchAction: 'none' }}
        >
          <Resize />
        </div>
        <img
          {...props.node.attrs}
          ref={imageRef}
          className='postimage'
          onLoad={handleImageLoad}
        />
      </div>
    </NodeViewWrapper>
  )
}
