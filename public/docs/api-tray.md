# System Tray

The System Tray API allows you to minimize your application to the OS notification area (the bottom right corner on Windows, or the top menu bar on macOS).

This is incredibly useful for background applications, music players, or chat apps that need to stay open without cluttering the user's taskbar.

## Initializing the Tray

You can easily set up a system tray icon by calling the tray initialization function in your Nim backend.

```nim title="app.nim"
import jazzy_desktop

# You can do this before or after startDesktopApp
setupSystemTray("app_icon.ico", "My Awesome App")
```

The string passed as the second argument (`"My Awesome App"`) will be shown as a tooltip when the user hovers over the tray icon.

> [!IMPORTANT]
> The tray icon relies on a valid icon file (like `.ico` on Windows). Make sure `app_icon.ico` exists in the root of your project directory!

## Creating a Context Menu

A tray icon isn't very useful without a right-click context menu. You can dynamically build this menu and bind Nim functions to the clicks.

```nim title="app.nim"
import jazzy_desktop
import os

# Build the tray menu
let menuItems = @[
  TrayMenuItem(title: "Open Dashboard", action: proc() = echo "Dashboard opened!"),
  TrayMenuItem(title: "Settings", action: proc() = echo "Settings opened!")
]

# Apply the menu
setTrayMenu(menuItems)

> [!NOTE]
> Jazzy Desktop automatically appends an "Exit" button to the bottom of every system tray menu for you. You don't need to manually implement an exit action!

startDesktopApp(title = "My App")
```

## Hiding the Window to Tray

A common pattern is to hide the application window when the user clicks the "Close" or "Minimize" button, keeping it alive in the System Tray.

You can combine the Tray API with the [Window API](/docs/api-window) to achieve this:

:::jazzy-snippet
action: hideToTray
label: Hide To Tray
---
jazzy.jazzyWindowHide()
:::

Then, you could have an "Open" option in your `setTrayMenu` that calls `jazzyWindowShow()` from the Nim side!
