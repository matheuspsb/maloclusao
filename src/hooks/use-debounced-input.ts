import { useState, useRef, useCallback } from "react"

export function useDebouncedInput(
  initialValue: string,
  onDebounced: (value: string) => void,
  delay = 300,
) {
  const [value, setValue] = useState(initialValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onChange = useCallback(
    (next: string) => {
      setValue(next)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        onDebounced(next)
      }, delay)
    },
    [onDebounced, delay],
  )

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setValue("")
    onDebounced("")
  }, [onDebounced])

  return { value, onChange, clear } as const
}
