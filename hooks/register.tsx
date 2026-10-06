import type { Register } from 'claude-code'

import { hasArabic, lacksBidi, reorder, shape, visualLines } from './bidi.ts'

const SPINNER: Record<string, string> = {
  requesting: 'يرسل',
  thinking: 'يفكر',
  responding: 'يكتب',
  'tool-input': 'يجهز',
  'tool-use': 'ينفذ',
}

const language = (thinking: string) => [
  'Always answer the user in Arabic (Modern Standard Arabic, or the dialect the user writes in).',
  'Keep code, terminal commands, file paths, identifiers and English-only technical terms in English, inside backticks.',
  'Prefer bullet lists over markdown tables.',
  thinking === 'arabic'
    ? 'Do your internal reasoning / thinking in Arabic as well.'
    : 'Think in English, but write every reply in Arabic.',
].join('\n')

export const register: Register = (on, options) => {
  let visual = options.rtl === 'visual'

  on('session.start', async ($, e, next) => {
    if (options.rtl === 'auto') {
      visual = lacksBidi({
        TERM_PROGRAM: await $.env.get('TERM_PROGRAM'),
        TERM: await $.env.get('TERM'),
        ALACRITTY_WINDOW_ID: await $.env.get('ALACRITTY_WINDOW_ID'),
      })
    }
    return next(e)
  })

  on('prompt.compose', async ($, e, next) => {
    const r = await next(e)
    return { sections: [...r.sections, { id: 'arabic:language', text: language(String(options.thinking)), scope: 'session' }] }
  })

  on('ui.render', { component: 'Spinner' }, ($, e, next) => {
    const word = SPINNER[e.props.mode]
    if (!word) return next(e)
    const isTerminal = e.surface === 'terminal' && visual
    return next({ ...e, props: { ...e.props, word: isTerminal ? reorder(shape(`${word}…`)) : word, suffix: isTerminal ? '' : e.props.suffix } })
  })

  on('ui.render', { component: 'UserMessage' }, ($, e, next) => {
    if (e.surface !== 'terminal' || !visual || !hasArabic(e.props.text)) return next(e)
    const width = (e.viewport?.columns ?? 80) - 4
    const text = e.props.text.split('\n').flatMap(l => visualLines(l, width)).join('\n')
    return next({ ...e, props: { ...e.props, text } })
  })

  // ponytail: draws Arabic replies as plain lines (headings bold, code fences untouched,
  // inline ** and ` markers dropped); the engine's markdown is kept for replies with no Arabic.
  on('ui.render', { component: 'AssistantMessage' }, ($, e, next) => {
    if (e.surface !== 'terminal' || !visual || !hasArabic(e.props.text)) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const width = (e.viewport?.columns ?? 80) - 2
    const rows: { text: string; bold?: boolean; code?: boolean }[] = []
    let inCode = false
    for (const raw of e.props.text.split('\n')) {
      if (raw.trimStart().startsWith('```')) { inCode = !inCode; continue }
      if (inCode) { rows.push({ text: raw, code: true }); continue }
      const heading = /^#{1,6}\s+/.test(raw)
      const line = raw.replace(/^#{1,6}\s+/, '').replace(/^(\s*)[-*+]\s+/, '$1• ').replace(/\*\*|__|`/g, '')
      for (const v of visualLines(line, width)) rows.push({ text: v, bold: heading })
    }
    return (
      <Box flexDirection="column">
        {rows.map(r => <Text bold={r.bold} color={r.code ? 'cyan' : undefined}>{r.text || ' '}</Text>)}
      </Box>
    )
  })
}
