/** Run callback at most once per animation frame. */
export function rafThrottle<T extends (...args: never[]) => void>(fn: T): T {
  let frame = 0
  let lastArgs: Parameters<T> | null = null

  const run = () => {
    frame = 0
    if (lastArgs) {
      fn(...lastArgs)
      lastArgs = null
    }
  }

  return ((...args: Parameters<T>) => {
    lastArgs = args
    if (!frame) frame = requestAnimationFrame(run)
  }) as T
}
