import { expect, test } from 'claude-code/testing'

import { parseTranslations } from './menus.ts'

test('reads the model reply only when it is a JSON array of the right size', async () => {
  expect(parseTranslations('Here:\n["مسح", "ضغط"]', 2)).toEqual(['مسح', 'ضغط'])
  expect(parseTranslations('["مسح"]', 2)).toBe(null)
  expect(parseTranslations('[1, 2]', 2)).toBe(null)
  expect(parseTranslations('no json', 1)).toBe(null)
})
