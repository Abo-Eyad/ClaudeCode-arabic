import { expect, test } from 'claude-code/testing'

import { reorder, shape, visualLines, wrap } from './bidi.ts'

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
