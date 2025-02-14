import { useState } from 'react'

export const useDebounce = (fn: (...args: any[]) => void, timeout = 500) => {
  const [timeoutPid, setTimeoutPid] = useState<ReturnType<typeof setTimeout>>()

  return (...args: any[]) => {
    if (timeoutPid) {
      clearTimeout(timeoutPid)
    }

    setTimeoutPid(setTimeout(() => fn(...args), timeout))
  }
}
