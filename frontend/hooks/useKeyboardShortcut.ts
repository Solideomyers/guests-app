import { useEffect } from 'react';

/**
 * Hook for keyboard shortcuts
 * UX Principle #11: Display Useful Shortcuts
 * Helps power users be more productive
 *
 * @param key - Key to listen for (e.g., 'n', 'Escape')
 * @param callback - Function to call when key is pressed
 * @param modifiers - Optional modifiers (ctrl, alt, shift, meta)
 */
interface KeyboardShortcutOptions {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: KeyboardShortcutOptions = {}
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if modifiers match
      const ctrlMatch = options.ctrl
        ? event.ctrlKey || event.metaKey
        : !event.ctrlKey && !event.metaKey;
      const altMatch = options.alt ? event.altKey : !event.altKey;
      const shiftMatch = options.shift ? event.shiftKey : !event.shiftKey;

      // Check if key matches (case insensitive)
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();

      // Ignore shortcuts when typing in inputs
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (event.target as HTMLElement).tagName
      );

      if (keyMatch && ctrlMatch && altMatch && shiftMatch && !isTyping) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, options]);
}
