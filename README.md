# Claude Code بالعربي — Arabic for Claude Code

يجعل Claude Code يرد ويفكر بالعربية، ويصلح اتجاه النص العربي (RTL) في الطرفيات التي لا تدعم الاتجاه الثنائي.
Makes Claude Code reply and think in Arabic, and fixes right-to-left Arabic in terminals without BiDi support.

## التثبيت / Install

In a Claude Code terminal session:

```
/plugin install arabic --marketplace Abo-Eyad/ClaudeCode-arabic
```

Answer `y` to add the marketplace, then pick the **user** scope.

## الإعدادات / Settings (`/config` → arabic)

| Setting | Values | Meaning |
| --- | --- | --- |
| RTL mode | `visual` (default) | The mod reorders and joins Arabic letters itself. Use with Windows Terminal, VS Code terminal, macOS Terminal, iTerm2, Alacritty, kitty. |
| | `native` | Your terminal does BiDi itself (WezTerm with `bidi_enabled`, Konsole, GNOME Terminal, mlterm). |
| Thinking language | `arabic` (default) / `english` | English thinking is slightly cheaper; replies stay Arabic. |

## إعدادات الطرفية / Terminal setup

- **Windows:** use Windows Terminal (not the old `cmd` console window). Keep RTL mode `visual`; Windows Terminal has no BiDi option.
- **Font:** one with Arabic glyphs, e.g. Cascadia Mono (2404+), DejaVu Sans Mono, Kawkab Mono, Vazir Code.
- **WezTerm (optional, for `native`):** in `~/.wezterm.lua`:
  ```lua
  config.bidi_enabled = true
  config.bidi_direction = 'AutoLeftToRight'
  ```

## حدود معروفة / Known limits

- The prompt box while you type is drawn by Claude Code and can't be hooked: Arabic looks wrong until you press Enter.
- The thinking view (ctrl+o) is not hookable either: Claude thinks in Arabic, but it shows unfixed there.
- Copying Arabic from the screen in `visual` mode copies the reordered text; the saved conversation is untouched.
- Arabic replies are drawn as plain lines: headings bold, code blocks kept, `**` and `` ` `` markers dropped. Tashkeel is dropped.
- Claude Code's own menus stay English; the spinner words are Arabic.
