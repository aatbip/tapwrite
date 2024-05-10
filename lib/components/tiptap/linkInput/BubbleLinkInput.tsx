import { DeleteIcon } from './../../../icons'
import { InputAdornment, TextField } from '@mui/material'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import * as React from 'react'

const BubbleLinkInput = () => {

  const [url, setUrl] = useState('')

  const urlInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (event: SyntheticEvent<HTMLDivElement>) => {
    //@ts-expect-error event should contain code
    if (event.code === 'Escape') {
      event.preventDefault()
    }

    //@ts-expect-error event should contain code
    if (event.code === 'Enter') {
      event.preventDefault()
      // tiptapEditorUtils.insertLink(fixUrl(url))
      setUrl('')
    }
  }

  useEffect(() => {
    if (urlInputRef.current) {
      urlInputRef.current.focus()
    }
  }, [urlInputRef.current])


  return (
    <TextField
      type='text'
      variant='outlined'
      InputProps={{
        endAdornment: (
          <InputAdornment
            position='end'
            sx={{
              cursor: 'pointer',
            }}
          >
            <DeleteIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiInputBase-input': {
          padding: '8px 12px',
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: '#DFE1E4',
          },
          '&:hover fieldset': {
            borderColor: '#DFE1E4',
          },
        },
        background: '#fff',
        borderRadius: '8px',
      }}
      onChange={(e) => setUrl(e.target.value)}
      ref={urlInputRef}
      onKeyDown={handleKeyDown}
      value={url}
      autoFocus
    />
  )
}

export default BubbleLinkInput
