import { useState } from 'react'

/**
 * onChange Event state
 * @param initialState
 * @param modify
 */
function useInputChange(
  initialState,
  modify
) {
  const [value, setValue] = useState(initialState)
  const changeEvent = (event) => {
    let value = event.target.value
    if (modify === 'trim') {
      value = value.trim()
    }
    setValue(value)
  }
  return [value, changeEvent, setValue]
}

export default useInputChange

