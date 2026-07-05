# Window Management

The `window` API provides methods to control the main desktop window programmatically from both your Nim backend and JavaScript frontend.

## API Reference

### `jazzyWindowCenter()`
Centers the window on the primary monitor.

:::jazzy-snippet
action: centerWindow
label: Center Window
---
jazzy.jazzyWindowCenter()
:::

### `jazzyWindowMinimize()`
Minimizes the window to the taskbar.

:::jazzy-snippet
action: minimizeWindow
label: Minimize
---
jazzy.jazzyWindowMinimize()
:::

### `jazzyWindowMaximize()`
Maximizes the window to fill the entire screen, or restores it if it is already maximized.

:::jazzy-snippet
action: maximizeWindow
label: Maximize
---
jazzy.jazzyWindowMaximize()
:::

### `jazzyWindowHide()` & `jazzyWindowShow()`
Hides the window entirely (making it invisible) or shows it again. This is extremely useful when combined with the [System Tray](/docs/api-tray) API.

:::jazzy-snippet
action: hideWindow
label: Hide Window
---
jazzy.jazzyWindowHide()
:::

## Window Configuration

When starting your app in `src/app.nim`, you can pass various configuration options to define how the window looks.

```nim title="app.nim"
import jazzy_desktop

startDesktopApp(
  title = "My App",
  width = 1024,
  height = 768,
  # Additional options:
  frameless = true,  # Removes the OS window borders
)
```

> [!TIP]
> **Mica Effect (Windows 11)**
> If you set `frameless = true`, Jazzy Desktop will automatically attempt to apply the native Windows 11 **Mica** frosted-glass effect to your window background, giving it a stunning modern look!
