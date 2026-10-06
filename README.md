# Claude Code بالعربي — Arabic for Claude Code

يجعل Claude Code يرد ويفكر بالعربية، ويعرّب قائمة `/config` ووصف الأوامر، مع إصلاح اتجاه النص (RTL) في الطرفيات التي تعرض العربية مقلوبة.
Makes Claude Code reply and think in Arabic, translates the `/config` menu and command descriptions, and fixes right-to-left Arabic in terminals that show it reversed.

## التثبيت / Install

In a Claude Code terminal session:

```
/plugin install arabic --marketplace Abo-Eyad/ClaudeCode-arabic
```

Answer `y` to add the marketplace, then pick the **user** scope.

## الإعدادات / Settings (`/config` → arabic)

| Setting | Values | Meaning |
| --- | --- | --- |
| RTL mode | `auto` (default) | Detects the terminal: `visual` for VS Code, kitty, Alacritty, Ghostty and WezTerm; `native` for everything else (tested on Windows Terminal). |
| | `native` | Your terminal shows Arabic itself. |
| | `visual` | Use only if Arabic shows reversed or with disconnected letters: the mod reorders and joins it itself. |
| Menu language | `arabic` (default) / `english` | Language of the `/config` menu and the slash-command descriptions. |
| Thinking language | `arabic` (default) / `english` | Language Claude reasons in, and of the spinner words. English is slightly cheaper; replies stay Arabic either way. |

## إعدادات الطرفية / Terminal setup

- **Windows:** use Windows Terminal (not the old `cmd` console window). Nothing to change.
- **Arabic reversed or letters disconnected?** Your terminal doesn't do right-to-left: `/config` → arabic → RTL mode → `visual`.
- **Font:** one with Arabic glyphs, e.g. Cascadia Mono (2404+), DejaVu Sans Mono, Kawkab Mono, Vazir Code.
- **WezTerm (optional):** turn on its own RTL support in `~/.wezterm.lua`, then set RTL mode to `native`:
  ```lua
  config.bidi_enabled = true
  config.bidi_direction = 'AutoLeftToRight'
  ```

## حدود معروفة / Known limits

In `visual` mode only:

- The prompt box while you type and the thinking view (ctrl+o) can't be hooked, so Arabic there stays as your terminal shows it.
- Copying Arabic from the screen copies the reordered text; the saved conversation is untouched.
- Arabic replies are drawn as plain lines: headings bold, code blocks kept, `**` and `` ` `` markers dropped. Tashkeel is dropped.

Always:

- Menu translation runs once in the background with a small model (Haiku) and is cached; until it finishes, or for anything new, the menus show English. Setting values (`true`/`false`, option names) and command names stay English.

## الرخصة / License

MIT — see [LICENSE](LICENSE).
