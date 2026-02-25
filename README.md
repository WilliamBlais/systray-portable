# systray-portable

A small Go binary that exposes a native system tray icon to any language via a simple stdin/stdout JSON protocol. No native bindings required — spawn the process, send JSON, react to clicks.

Actively maintained fork of [zaaack/systray-portable](https://github.com/zaaack/systray-portable), with Go modules, multi-arch support (including Linux/macOS arm64), and automated releases via GitHub Actions.

## Download

Pre-built binaries are available on the [Releases](https://github.com/WilliamBlais/systray-portable/releases) page for:

| Platform | amd64 | arm64 |
|----------|-------|-------|
| macOS    | ✓     | ✓     |
| Linux    | ✓     | ✓     |
| Windows  | ✓     | ✓     |

## Protocol

Each line on stdin/stdout is a JSON string.

### 1. Ready

On startup the binary emits:
```json
{"type": "ready"}
```

### 2. Init menu (your process → tray)

Send a single JSON line to initialize the tray:
```json
{
  "icon": "<base64-encoded image>",
  "title": "Title",
  "tooltip": "Tooltip",
  "items": [
    { "title": "Item 1", "tooltip": "Hint", "checked": true,  "enabled": true },
    { "title": "Item 2", "tooltip": "Hint", "checked": false, "enabled": true }
  ]
}
```

### 3. Click event (tray → your process)

When a menu item is clicked:
```json
{
  "type": "clicked",
  "item": { "title": "Item 1", "tooltip": "Hint", "enabled": true, "checked": true },
  "seq_id": 0
}
```

### 4. Update (your process → tray)

Send at any time to update an item, the menu, or both:

**update-item**
```json
{ "type": "update-item", "item": { "title": "New label", "tooltip": "Hint", "enabled": true, "checked": false }, "seq_id": 0 }
```

**update-menu**
```json
{ "type": "update-menu", "menu": { "icon": "<base64>", "title": "New title", "tooltip": "Hint" } }
```

**update-item-and-menu**
```json
{ "type": "update-item-and-menu", "item": { ... }, "menu": { ... }, "seq_id": 0 }
```

## Build

Requires Go and, on Linux, `libayatana-appindicator3-dev`.

```sh
# Current platform (macOS builds both amd64 + arm64)
node build.js

# Manually
go build -o tray_linux_amd64 tray.go
go build -o tray_linux_amd64_release -ldflags "-s -w" tray.go
```
