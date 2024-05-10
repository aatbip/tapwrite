import * as React from 'react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const AutofillContainerBtn = ({
  handleClick,
  label,
  focus,
}: {
  handleClick: () => void
  label: string
  focus: boolean
}) => {
  return (
    <button
      className={`flex flex-row gap-x-2.5 items-center py-1.5 px-3 cursor-pointer outline-none ${focus && 'bg-new-white-2'
        } display-block`}
      onClick={() => {
        handleClick()
      }}
    >
      <div>
        <p className='text-sm'>{label}</p>
      </div>
    </button>
  )
}

export const AutofillMenu = forwardRef((props: any, ref: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: any) => {
    const item = props.items[index]

    if (item) {
      props.command({ id: item })
    }
  }

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length,
    )
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  const { items } = props

  return (
    <div className='flex flex-col gap-0.5 bg-white py-2 border border-new-card-border rounded shadow-vairant-1 w-fit overflow-hidden relative'>
      {items && items?.length ? (
        items.map((item: any, index: any) => (
          <AutofillContainerBtn
            key={index}
            handleClick={() => {
              selectItem(index)
            }}
            label={item}
            focus={index === selectedIndex}
          />
        ))
      ) : (
        <AutofillContainerBtn
          label={'No Options'}
          handleClick={() => { }}
          focus={false}
        />
      )}
    </div>
  )
})

AutofillMenu.displayName = 'AutofillMenu'
