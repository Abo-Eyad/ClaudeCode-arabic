# Claude Code بالعربي — Arabic for Claude Code

يجعل Claude Code يرد ويفكر بالعربية، مع وضع اختياري لإصلاح اتجاه النص (RTL) في الطرفيات التي تعرض العربية مقلوبة.
Makes Claude Code reply and think in Arabic, with an optional right-to-left fix for terminals that show Arabic reversed.

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
| Thinking language | `arabic` (default) / `english` | English thinking is slightly cheaper; replies stay Arabic. |

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

- Claude Code's own menus stay English; the spinner words are Arabic.

## الرخصة / License

MIT — see [LICENSE](LICENSE).
