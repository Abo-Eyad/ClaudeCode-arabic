// Arabic for terminals with no BiDi support: shape letters into presentation
// forms, then lay each line out in visual (left-to-right cell) order.
// ponytail: simplified UBA (strong runs + neutrals from neighbours, no embeddings
// or explicit marks); swap for a full UBA if mixed-direction lines read wrong.

// Joining class per letter, U+0621..U+063A then U+0641..U+064A, in the same order
// as their forms in U+FE80..U+FEF4: 1 = isolated only, 2 = right-joining, 4 = dual.
const CLASSES = '12222424244444222244444444' + '4444444224'
const FORMS = new Map<number, { at: number; n: number }>()
{
  let at = 0xfe80
  Array.from(CLASSES).forEach((c, i) => {
    const n = Number(c)
    FORMS.set(i < 26 ? 0x0621 + i : 0x0641 + i - 26, { at, n })
    at += n
  })
}
const TATWEEL = 0x0640
// لآ لأ لإ لا -> isolated form; final is +1
const LAM_ALEF = new Map([[0x0622, 0xfef5], [0x0623, 0xfef7], [0x0625, 0xfef9], [0x0627, 0xfefb]])

const isMark = (c: number) => (c >= 0x064b && c <= 0x065f) || c === 0x0670
const joinsNext = (c?: number) => c === TATWEEL || FORMS.get(c ?? -1)?.n === 4
const joinsPrev = (c?: number) => c === TATWEEL || (FORMS.get(c ?? -1)?.n ?? 0) >= 2

export const hasArabic = (s: string) => /[؀-ۿݐ-ݿ]/.test(s)

// ponytail: drops tashkeel, since a combining mark lands on the wrong cell once reversed.
export function shape(text: string): string {
  const cps = Array.from(text, ch => ch.codePointAt(0)!).filter(c => !isMark(c))
  const out: number[] = []
  for (let i = 0; i < cps.length; i++) {
    const c = cps[i]!
    const form = FORMS.get(c)
    if (!form) { out.push(c); continue }
    const prev = joinsNext(cps[i - 1])
    const lig = c === 0x0644 ? LAM_ALEF.get(cps[i + 1] ?? -1) : undefined
    if (lig) { out.push(lig + (prev ? 1 : 0)); i++; continue }
    const next = form.n === 4 && joinsPrev(cps[i + 1])
    const k = form.n === 1 ? 0 : prev && next ? 3 : prev ? 1 : next ? 2 : 0
    out.push(form.at + k)
  }
  return String.fromCodePoint(...out)
}

type Dir = 'R' | 'L' | 'N'
const dirOf = (ch: string): Dir =>
  /[٠-٩۰-۹]/.test(ch) ? 'L'
  : /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(ch) ? 'R'
  : /[\p{L}\p{N}]/u.test(ch) ? 'L' : 'N'
const MIRROR: Record<string, string> = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '«': '»', '»': '«' }

export const isRtl = (line: string) => Array.from(line).map(dirOf).find(d => d !== 'N') === 'R'

/** One already-shaped line, logical order in, visual order out. */
export function reorder(line: string): string {
  const chars = Array.from(line)
  const base: Dir = isRtl(line) ? 'R' : 'L'
  const dirs = chars.map(dirOf)
  for (let i = 0; i < dirs.length; ) {
    if (dirs[i] !== 'N') { i++; continue }
    let j = i
    while (j < dirs.length && dirs[j] === 'N') j++
    const before = i > 0 ? dirs[i - 1]! : base
    const after = j < dirs.length ? dirs[j]! : base
    dirs.fill(before === after ? before : base, i, j)
    i = j
  }
  const runs: { d: Dir; s: string[] }[] = []
  chars.forEach((ch, i) => {
    const last = runs[runs.length - 1]
    const d = dirs[i]!
    if (last && last.d === d) last.s.push(ch)
    else runs.push({ d, s: [ch] })
  })
  if (base === 'R') runs.reverse()
  return runs.map(r => r.d === 'R' ? r.s.reverse().map(c => MIRROR[c] ?? c).join('') : r.s.join('')).join('')
}

/** Greedy word wrap to `width` cells; a word longer than a line is cut. */
export function wrap(line: string, width: number): string[] {
  const out: string[] = []
  let cur = ''
  for (const word of line.split(' ')) {
    let w = word
    while (Array.from(w).length > width) {
      if (cur) { out.push(cur); cur = '' }
      out.push(Array.from(w).slice(0, width).join(''))
      w = Array.from(w).slice(width).join('')
    }
    const next = cur ? `${cur} ${w}` : w
    if (Array.from(next).length > width) { out.push(cur); cur = w } else cur = next
  }
  out.push(cur)
  return out
}

/** A logical line to the visual lines a non-BiDi terminal draws right; RTL lines right-aligned. */
export function visualLines(line: string, width: number): string[] {
  const shaped = shape(line)
  const rtl = isRtl(shaped)
  return wrap(shaped, width).map(l => {
    const v = reorder(l)
    return rtl ? v.padStart(width) : v
  })
}

// ponytail: only terminals known to draw Arabic unjoined/LTR; any other (Windows Terminal,
// Konsole, GNOME Terminal, tmux, ...) is trusted to do BiDi itself. Add to this list as reports come in.
// WezTerm is listed because its bidi_enabled is off by default.
export const lacksBidi = (env: { TERM_PROGRAM?: string; TERM?: string; ALACRITTY_WINDOW_ID?: string }) =>
  /^(vscode|wezterm|ghostty)$/i.test(env.TERM_PROGRAM ?? '') ||
  /kitty|alacritty/.test(env.TERM ?? '') ||
  env.ALACRITTY_WINDOW_ID !== undefined
