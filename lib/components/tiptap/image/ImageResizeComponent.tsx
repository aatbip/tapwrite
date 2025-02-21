import { NodeViewWrapper } from '@tiptap/react'
import { Resizable } from 're-resizable'
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { LoadingPlaceholder } from './loadingPlaceholder'
import { Resize } from './resizeIcon'

export const ImageResizeComponent = (props: any) => {
  const { editor } = props
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState({
    width: props.node.attrs.width,
    height: props.node.attrs.height,
  })
  const [aspectRatio, setAspectRatio] = useState(1)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLImageElement | null>(null)

  const observerRef = useRef<MutationObserver | null>(null)

  const [maxWidth, setMaxWidth] = useState<number>(0) // Dynamically calculate max width
  const [maxHeight, setMaxHeight] = useState<number>(0) // Dynamically calculate max width

  const [isEditable, setIsEditable] = useState(editor.isEditable)

  useEffect(() => {
    const updateEditableState = () => {
      setIsEditable(editor.isEditable)
    }

    editor.on('update', updateEditableState)

    return () => {
      editor.off('update', updateEditableState)
    }
  }, [editor])

  // Dynamically update the max width based on the container size
  const updateDimensions = useCallback(() => {
    if (imageRef.current && containerRef.current) {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight
      const containerWidth = containerRef.current.clientWidth

      setMaxWidth(containerWidth)
      setMaxHeight(containerWidth / (naturalWidth / naturalHeight))
      setAspectRatio(naturalWidth / naturalHeight)

      if (typeof props.node.attrs.width !== 'number') {
        props.updateAttributes({ width: naturalWidth })
      }
      if (typeof props.node.attrs.height !== 'number') {
        props.updateAttributes({ height: naturalHeight })
      }
      if (naturalWidth && naturalWidth < 40) {
        props.updateAttributes({
          width: 40,
          height: 40 / (naturalWidth / naturalHeight),
        })
      }
    }
  }, [props])

  const handleImageLoad = useCallback(() => {
    setLoading(false)
    updateDimensions()
  }, [updateDimensions])

  useEffect(() => {
    if (containerRef.current) {
      observerRef.current = new MutationObserver(updateDimensions)
      observerRef.current.observe(containerRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      })
    }

    window.addEventListener('resize', updateDimensions)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      window.removeEventListener('resize', updateDimensions)
    }
  }, [updateDimensions])

  useEffect(() => {
    setSize({
      width: props.node.attrs.width,
      height: props.node.attrs.height,
    })
  }, [props.node.attrs.width, props.node.attrs.height])

  const onResize = (_e: any, _direction: any, ref: any, _d: any) => {
    const newWidth = parseFloat(ref.style.width)
    const newHeight = newWidth / aspectRatio
    setSize({
      width: newWidth,
      height: newHeight,
    })
  }
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }
    // Use a timeout to only call single click callback after 250ms to prevent clashing with double click
    clickTimeout.current = setTimeout(() => {
      props.extension.options.handleImageClick?.(event)
      clickTimeout.current = null
    }, 250)
  }

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
      clickTimeout.current = null
    }
    props.extension.options.handleImageDoubleClick?.(event)
  }

  const onResizeStop = (_e: any, _direction: any, ref: any, _d: any) => {
    const newWidth = parseFloat(ref.style.width)
    const newHeight = newWidth / aspectRatio

    const widthDiff = newWidth >= maxWidth - 5 ? newWidth - (maxWidth - 5) : 0
    const heightDiff =
      newHeight >= maxHeight - 5 ? newHeight - (maxHeight - 5) : 0
    props.updateAttributes({
      width: widthDiff > 0 ? 650 : newWidth,
      height: heightDiff > 0 ? 650 / aspectRatio : newHeight,
    })
  }

  return (
    <NodeViewWrapper className='image-resizer' ref={containerRef}>
      {loading && (
        <LoadingPlaceholder
          width={props.node.attrs.width as number}
          height={props.node.attrs.height as number}
        />
      )}
      <div style={{ display: loading ? 'none' : 'block' }}>
        <Resizable
          size={size}
          onResize={onResize}
          style={{
            borderRadius: '5px',
            width: props.node.attrs.width,
            height: props.node.attrs.height,
          }}
          onResizeStop={onResizeStop}
          lockAspectRatio={aspectRatio}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          minHeight={40}
          minWidth={40}
          enable={
            isEditable
              ? {
                  top: false,
                  right: true,
                  bottom: false,
                  left: true,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false,
                }
              : false
          }
          handleComponent={{
            left: isEditable && (
              <div
                className='resize-trigger left'
                style={{ cursor: 'ew-resize', width: '10px', height: '25%' }}
              >
                <Resize />
              </div>
            ),
            right: isEditable && (
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
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '2px',
              outline:
                props.selected && isEditable ? '1.5px solid #212B36' : 'none',
              outlineOffset: '-1.5px',
            }}
          />
        </Resizable>
      </div>
    </NodeViewWrapper>
  )
}
