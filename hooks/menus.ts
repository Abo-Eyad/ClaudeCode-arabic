export const BATCH = 40

export const TRANSLATE_SYSTEM = 'You translate Claude Code UI strings (slash-command descriptions, settings labels) to Modern Standard Arabic. Keep command names, file names, code, flags and product names (Claude, Claude Code, MCP, Git) in English. Reply with only a JSON array of strings, same order and length as the input.'

/** The model's reply to a JSON array of `n` strings, or null when it is anything else. */
export function parseTranslations(text: string, n: number): string[] | null {
  try {
    const arr: unknown = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1))
    return Array.isArray(arr) && arr.length === n && arr.every(s => typeof s === 'string') ? arr : null
  } catch {
    return null
  }
}
