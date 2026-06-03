import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeAll } from 'vitest'
import { useResizeObserver } from './useResizeObserver'

let triggerResize: (width: number) => void = () => {}

beforeAll(() => {
  class FakeResizeObserver {
    cb: ResizeObserverCallback
    constructor(cb: ResizeObserverCallback) {
      this.cb = cb
      triggerResize = (width: number) =>
        this.cb([{ contentRect: { width } } as ResizeObserverEntry], this)
    }
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  // @ts-expect-error jsdom lacks ResizeObserver
  globalThis.ResizeObserver = FakeResizeObserver
})

function Probe() {
  const { ref, width } = useResizeObserver<HTMLDivElement>()
  return <div ref={ref} data-testid="probe">{width}</div>
}

describe('useResizeObserver', () => {
  it('reports the observed container width', () => {
    render(<Probe />)
    act(() => triggerResize(640))
    expect(screen.getByTestId('probe').textContent).toBe('640')
  })
})
