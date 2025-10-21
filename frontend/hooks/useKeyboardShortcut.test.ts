import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcut } from './useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    callback = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call callback when key is pressed', () => {
    renderHook(() => useKeyboardShortcut('n', callback));

    const event = new KeyboardEvent('keydown', { key: 'n' });
    window.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should be case insensitive', () => {
    renderHook(() => useKeyboardShortcut('n', callback));

    // Lowercase
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    expect(callback).toHaveBeenCalledTimes(1);

    // Uppercase
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'N' }));
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should call callback with ctrl modifier', () => {
    renderHook(() => useKeyboardShortcut('s', callback, { ctrl: true }));

    // Without ctrl
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    expect(callback).not.toHaveBeenCalled();

    // With ctrl
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 's', ctrlKey: true })
    );
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call callback with meta modifier (Mac Cmd)', () => {
    renderHook(() => useKeyboardShortcut('s', callback, { ctrl: true }));

    // With meta (Cmd on Mac)
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 's', metaKey: true })
    );
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call callback with alt modifier', () => {
    renderHook(() => useKeyboardShortcut('a', callback, { alt: true }));

    // Without alt
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(callback).not.toHaveBeenCalled();

    // With alt
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', altKey: true })
    );
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call callback with shift modifier', () => {
    renderHook(() => useKeyboardShortcut('d', callback, { shift: true }));

    // Without shift
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    expect(callback).not.toHaveBeenCalled();

    // With shift
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'd', shiftKey: true })
    );
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call callback with multiple modifiers', () => {
    renderHook(() =>
      useKeyboardShortcut('k', callback, { ctrl: true, shift: true })
    );

    // Without modifiers
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    expect(callback).not.toHaveBeenCalled();

    // With only ctrl
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
    );
    expect(callback).not.toHaveBeenCalled();

    // With both ctrl and shift
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        shiftKey: true,
      })
    );
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle Escape key', () => {
    renderHook(() => useKeyboardShortcut('Escape', callback));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle special keys', () => {
    const enterCallback = vi.fn();
    renderHook(() => useKeyboardShortcut('Enter', enterCallback));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(enterCallback).toHaveBeenCalledTimes(1);
  });

  it('should not trigger when typing in input', () => {
    renderHook(() => useKeyboardShortcut('n', callback));

    const input = document.createElement('input');
    document.body.appendChild(input);

    const event = new KeyboardEvent('keydown', {
      key: 'n',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: input, writable: false });

    input.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('should not trigger when typing in textarea', () => {
    renderHook(() => useKeyboardShortcut('n', callback));

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    const event = new KeyboardEvent('keydown', {
      key: 'n',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', {
      value: textarea,
      writable: false,
    });

    textarea.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  it('should not trigger when typing in select', () => {
    renderHook(() => useKeyboardShortcut('n', callback));

    const select = document.createElement('select');
    document.body.appendChild(select);

    const event = new KeyboardEvent('keydown', {
      key: 'n',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: select, writable: false });

    select.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(select);
  });

  it('should cleanup event listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyboardShortcut('n', callback));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    expect(callback).toHaveBeenCalledTimes(1); // No additional calls
  });

  it('should update when callback changes', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender } = renderHook(({ cb }) => useKeyboardShortcut('n', cb), {
      initialProps: { cb: callback1 },
    });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    rerender({ cb: callback2 });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    expect(callback1).toHaveBeenCalledTimes(1); // No additional calls
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should prevent default browser behavior', () => {
    renderHook(() => useKeyboardShortcut('s', callback, { ctrl: true }));

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
