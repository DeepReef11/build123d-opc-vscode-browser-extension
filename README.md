# OCP CAD Viewer Keybindings — Chrome Extension

Chrome extension that adds keyboard shortcuts to the [OCP CAD Viewer](https://github.com/bernhard-42/vscode-ocp-cad-viewer) standalone web viewer.

## Keybindings

| Key | Action |
|-----|--------|
| `U` | Toggle distance measurement mode |

A toast notification confirms when measurement mode is toggled ON/OFF.

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
  { key: "u", selector: "input.tcv_button_distance", label: "Distance Measurement" },
  // Add more:
  // { key: "a", selector: "input.tcv_button_angle", label: "Angle Measurement" },
];
```

Each entry maps a key to a toolbar button CSS selector. The toolbar buttons follow the pattern `input.tcv_button_<name>` inside a `span.tcv_button_frame`.

## How it works

- Content script injects into the OCP CAD Viewer page at `localhost:3939`
- Polls for the three-cad-viewer toolbar (built dynamically after WebSocket data arrives)
- On keypress, finds and clicks the matching toolbar button
- Detects active state via `tcv_btn_click2` class on the button frame
- Ignores keypresses in input fields and when modifier keys are held

## License

MIT
