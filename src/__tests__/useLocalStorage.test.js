import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads the initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    expect(result.current[0]).toBe('default-value');
  });

  it('retrieves an existing parsed value from localStorage', () => {
    window.localStorage.setItem('test-key', JSON.stringify('saved-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    expect(result.current[0]).toBe('saved-value');
  });

  it('updates localStorage and state correctly', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

    act(() => {
      result.current[1]('updated-value');
    });

    expect(result.current[0]).toBe('updated-value');
    expect(JSON.parse(window.localStorage.getItem('test-key'))).toBe('updated-value');
  });

  it('falls back to the initial value if localStorage contains invalid JSON', () => {
    window.localStorage.setItem('test-key', '{invalid-json');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    expect(result.current[0]).toBe('default-value');
    spy.mockRestore();
  });

  it('falls back to the initial value if parsed type mismatches schema expectations', () => {
    window.localStorage.setItem('test-key', JSON.stringify('string-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', { key: 'object-expected' }));
    expect(result.current[0]).toEqual({ key: 'object-expected' });
  });
});
