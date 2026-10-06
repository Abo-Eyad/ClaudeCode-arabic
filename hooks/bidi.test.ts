import { expect, test } from 'claude-code/testing'

import { lacksBidi, reorder, shape, visualLines, wrap } from './bidi.ts'

test('shapes letters into joined presentation forms', async () => {
  // س initial, لا final ligature, م isolated (alef does not join forward)
  expect(shape('سلام')).toBe('ﺳﻼﻡ')
  expect(shape('مَرحبا')).toBe(shape('مرحبا')) // tashkeel dropped
})

test('reorders RTL lines and keeps English runs LTR', async () => {
  expect(reorder('ابج git status دهو')).toBe('وهد git status جبا')
  expect(reorder('hello مرحبا')).toBe('hello ابحرم')
  expect(reorder('(مرحبا)')).toBe('(ابحرم)')
  expect(reorder('رقم 123')).toBe('123 مقر')
})

test('wraps to width and right-aligns RTL lines', async () => {
  expect(wrap('aa bb cc', 5)).toEqual(['aa bb', 'cc'])
  const lines = visualLines('هذا سطر طويل جدا يجب أن يلتف', 10)
  expect(lines.length > 1).toBe(true)
  for (const l of lines) expect(Array.from(l).length).toBe(10)
})

test('auto mode picks visual only for terminals without BiDi', async () => {
  expect(lacksBidi({ TERM_PROGRAM: 'vscode', TERM: 'xterm-256color' })).toBe(true)
  expect(lacksBidi({ TERM: 'xterm-kitty' })).toBe(true)
  expect(lacksBidi({ TERM: 'xterm-256color', ALACRITTY_WINDOW_ID: '1' })).toBe(true)
  expect(lacksBidi({ TERM: 'xterm-256color' })).toBe(false) // Windows Terminal
  expect(lacksBidi({ TERM_PROGRAM: 'tmux', TERM: 'tmux-256color' })).toBe(false)
})
