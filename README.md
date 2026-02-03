# OCP CAD Viewer Keybindings — Chrome Extension

Chrome extension that adds keyboard shortcuts to the [OCP CAD Viewer](https://github.com/bernhard-42/vscode-ocp-cad-viewer) standalone web viewer.

## Keybindings

### Tools

| Key | Action |
|-----|--------|
| `u` | Toggle distance measurement |
| `Shift+u` | Toggle properties panel |

### Camera Views

| Key | Action |
|-----|--------|
| `0` | Iso view |
| `1` | Front view |
| `2` | Back view |
| `3` | Top view |
| `4` | Bottom view |
| `5` | Left view |
| `6` | Right view |

A toast notification confirms each action.

## Install

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select this folder

The extension activates on `localhost:3939` (the default OCP CAD Viewer standalone port).

## Adding new keybindings

Edit the `KEYBINDINGS` array at the top of `content.js`:

```js
const KEYBINDINGS = [
  { key: "u", shift: false, selector: "input.tcv_button_distance", label: "Distance Measurement" },
  { key: "u", shift: true,  selector: "input.tcv_button_properties", label: "Properties" },
  { key: "0", shift: false, selector: "input.tcv_button_iso",    label: "Iso View" },
  // ...
];
```

Each entry needs:
- `key` — the keyboard key (lowercase)
- `shift` — whether Shift must be held (`true` / `false`)
- `selector` — CSS selector for the toolbar button
- `label` — toast message text

Toolbar buttons follow the pattern `input.tcv_button_<name>` inside `span.tcv_button_frame`.

## How it works

- Content script injects into the OCP CAD Viewer page at `localhost:3939`
- Polls for the three-cad-viewer toolbar (built dynamically after WebSocket data arrives)
- On keypress, finds and clicks the matching toolbar button
- Detects active state via `tcv_btn_click2` class on the button frame
- Ignores keypresses in input fields and when Ctrl/Alt/Meta are held
- Shift is supported as a modifier (e.g. `Shift+u` for properties)

## License

MIT
