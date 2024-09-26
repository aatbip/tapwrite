import React, { useState, useCallback, useEffect, useRef } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Resizable } from 're-resizable'
import { LoadingPlaceholder } from './loadingPlaceholder'
import { Resize } from './resizeIcon'

export const ImageResizeComponent = (props: any) => {
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState({
    width: props.node.attrs.width,
    height: props.node.attrs.height,
  })
  const [aspectRatio, setAspectRatio] = useState(1)
  const [maxSize, setMaxSize] = useState({
    maxWidth: 0,
    maxHeight: 0,
  })
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const proseMirrorContainerDiv = document.querySelector('.ProseMirror')
    if (proseMirrorContainerDiv) {
      setSize((prevSize) => ({
        ...prevSize,
        maxWidth: proseMirrorContainerDiv.clientWidth,
      }))
    }
  }, [])

  const handleImageLoad = useCallback(() => {
    setLoading(false)
    if (imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight
      setMaxSize({
        maxWidth: naturalWidth,
        maxHeight: naturalHeight,
      })
      setAspectRatio(naturalWidth / naturalHeight)
    }
  }, [])

  const onResize = (_e: any, _direction: any, ref: any, _d: any) => {
    const newWidth = ref.style.width
    const newHeight = ref.style.height
    setSize({
      width: parseFloat(newWidth),
      height: parseFloat(newHeight),
    })
  }

  const onResizeStop = (_e: any, _direction: any, ref: any, _d: any) => {
    const newWidth = ref.style.width
    const newHeight = ref.style.height
    console.log(newWidth, newHeight)
    props.updateAttributes({
      width: parseFloat(newWidth),
      height: parseFloat(newHeight),
    })
  }

  return (
    <NodeViewWrapper
      className='image-resizer'
      style={{
        outline: props.selected ? '3px solid #0C41BB' : 'none',
        borderRadius: '5px',
      }}
    >
      {loading && <LoadingPlaceholder />}
      <div style={{ display: loading ? 'none' : 'block' }}>
        <Resizable
          size={size}
          onResize={onResize}
          onResizeStop={onResizeStop}
          lockAspectRatio={aspectRatio}
          maxWidth={maxSize.maxWidth}
          maxHeight={maxSize.maxHeight}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          handleComponent={{
            left: (
              <div
                className='resize-trigger left'
                style={{ cursor: 'ew-resize', width: '10px', height: '25%' }}
              >
                <Resize />
              </div>
            ),
            right: (
              <div
                className='resize-trigger right'
                style={{ cursor: 'ew-resize', width: '10px', height: '25%' }}
              >
                <Resize />
              </div>
            ),
          }}
        >
          <img
            {...props.node.attrs}
            ref={imageRef}
            className='postimage'
            onLoad={handleImageLoad}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '5px',
            }}
          />
        </Resizable>
      </div>
    </NodeViewWrapper>
  )
}
