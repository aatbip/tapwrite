import * as React from 'react'
import {
  Button,
  Popper,
  Stack,
} from '@mui/material'
import { FC, ReactNode, useEffect, useState, MouseEvent } from 'react'

import { CalloutIcon, H1Icon, H2Icon, H3Icon, TextIcon } from './../../../icons'
import { TiptapEditorUtils } from './../../../utils/tiptapEditorUtils'
import { Editor } from '@tiptap/react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'

interface IBubbleMenuContainer {
  editor: Editor
}

export enum Formatter {
  h1 = 'Heading 1',
  h2 = 'Heading 2',
  h3 = 'Heading 3',
  text = 'Text',
  autofillField = 'Autofill Fields',
  bulletList = 'Bullet List',
  numberedList = 'Numbered List',
  upload = 'Upload',
  embed = 'Embed',
  link = 'Link',
  unlink = 'Unlink',
  table = 'Table',
  callout = 'Callout',
  empty = 'No Options',
}

const DropdownBubbleMenu: FC<IBubbleMenuContainer> = ({ editor }) => {
  const [selectedFormatter, setSelectedFormatter] = useState<Formatter>(
    Formatter.text,
  )

  const tiptapEditorUtils = new TiptapEditorUtils(editor)

  const formatterIcon = {
    [Formatter.h1]: <H1Icon />,
    [Formatter.h2]: <H2Icon />,
    [Formatter.h3]: <H3Icon />,
    [Formatter.text]: <TextIcon />,
    [Formatter.callout]: <CalloutIcon />,
  }

  useEffect(() => {
    const parent = editor.state.selection.$anchor.parent
    const level = parent.attrs.level
    const name = parent.type.name

    if (name === 'heading' && level === 1) {
      setSelectedFormatter(Formatter.h1)
    }
    if (name === 'heading' && level === 2) {
      setSelectedFormatter(Formatter.h2)
    }
    if (name === 'heading' && level === 3) {
      setSelectedFormatter(Formatter.h3)
    }
    if (name === 'paragraph') {
      setSelectedFormatter(Formatter.text)
    }
    if (name === 'calloutComponent') {
      setSelectedFormatter(Formatter.callout)
    }
  }, [editor.state.selection.$anchor.parent])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  return (
    <Stack
      borderRight='2px solid rgb(203 213 225)'
      direction='column'
      justifyContent='center'
    >
      <Button
        variant='text'
        aria-describedby={id}
        type='button'
        onClick={handleClick}
        disableRipple
        startIcon={
          formatterIcon[selectedFormatter as keyof typeof formatterIcon]
        }
        endIcon={
          open ? (
            <KeyboardArrowUp sx={{ color: '#212B36' }} />
          ) : (
            <KeyboardArrowDown sx={{ color: '#212B36' }} />
          )
        }
        sx={{
          textTransform: 'none',
          color: '#212B36',
        }}
      >
        {selectedFormatter}
      </Button>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement='bottom-start'
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10],
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
      >
        <Stack
          direction='column'
          sx={{
            bgcolor: '#fff',
            padding: '8px 0px',
            width: '180px',
            borderRadius: '4px',
          }}
        >
          <BubbleDropdownBtnContainer
            icon={formatterIcon[Formatter.h1]}
            label={Formatter.h1}
            handleClick={() => {
              tiptapEditorUtils.toggleHeading(1)
              setAnchorEl(null)
            }}
          />
          <BubbleDropdownBtnContainer
            icon={formatterIcon[Formatter.h2]}
            label={Formatter.h2}
            handleClick={() => {
              tiptapEditorUtils.toggleHeading(2)
              setAnchorEl(null)
            }}
          />
          <BubbleDropdownBtnContainer
            icon={formatterIcon[Formatter.h3]}
            label={Formatter.h3}
            handleClick={() => {
              tiptapEditorUtils.toggleHeading(3)
              setAnchorEl(null)
            }}
          />
          <BubbleDropdownBtnContainer
            icon={formatterIcon[Formatter.text]}
            label={Formatter.text}
            handleClick={() => {
              tiptapEditorUtils.setParagraph()
              setAnchorEl(null)
            }}
          />
          {/* <BubbleDropdownBtnContainer */}
          {/*   icon={formatterIcon[Formatter.callout]} */}
          {/*   label={Formatter.callout} */}
          {/*   handleClick={() => { */}
          {/*     const text = tiptapEditorUtils.getSelectedText() */}
          {/*     tiptapEditorUtils.insertCallout(text) */}
          {/*     setAnchorEl(null) */}
          {/*   }} */}
          {/* /> */}
        </Stack>
      </Popper>
    </Stack>
  )
}

export default DropdownBubbleMenu

const BubbleDropdownBtnContainer = ({
  icon,
  label,
  handleClick,
}: {
  icon: ReactNode
  label: string
  handleClick: () => void
}) => {
  return (
    <button
      className={`flex flex-row gap-x-2.5 items-center py-1.5 px-3 hover:bg-new-white-2 cursor-pointer outline-none`}
      onClick={() => handleClick()}
    >
      <div>{icon}</div>
      <div>
        <p className='text-sm'>{label}</p>
      </div>
    </button>
  )
}
