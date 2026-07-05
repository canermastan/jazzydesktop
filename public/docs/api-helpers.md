# OS Utilities (Helpers)

Jazzy Desktop provides several built-in helper methods in Nim to make interacting with the host operating system much easier. These utilities handle cross-platform differences automatically, so you don't have to worry about writing OS-specific logic!

## Available Helpers

To use these helpers, simply import them in your Nim code:
```nim
import jazzy_desktop
```

### `getAppDir(appName: string): string`
Returns the standard application data directory for the current OS and automatically creates it if it doesn't exist. This is the recommended place to store your app's SQLite database or persistent configuration files.
- **Windows:** `C:\Users\Username\AppData\Roaming\YourApp`
- **Linux:** `~/.config/YourApp`
- **macOS:** `~/Library/Application Support/YourApp`

```nim
let dbPath = getAppDir("MyAwesomeApp") / "database.sqlite"
```

### `getCacheDir(appName: string): string`
Returns a temporary directory for caching files (like downloaded images or temporary processing data) and automatically creates it. Files here can be cleared by the OS.

```nim
let tempImage = getCacheDir("MyAwesomeApp") / "avatar.png"
```

### `getLogDir(appName: string): string`
Returns a dedicated `logs` directory inside your AppDir. This is ideal for storing crash reports and runtime logs.

```nim
let logFile = getLogDir("MyAwesomeApp") / "error.log"
```

### `showInFolder(path: string)`
Opens the native file manager (Windows Explorer, Finder, or Linux File Manager) and highlights the specified file. This is a very common feature in desktop apps when a user clicks "Show in Folder" after downloading or saving a file.

```nim title="app.nim"
proc revealFile(path: string) {.expose.} =
  showInFolder(path)
```

:::jazzy-snippet
action: handleReveal
label: Show in Folder
---
jazzy.revealFile("C:\\Users\\Jazzy\\Documents\\report.txt")
:::

### `isProduction(): bool`
Returns `true` if your application was compiled in release mode (e.g., using `jazzyd build`). This is extremely useful for toggling debug logging or developer tools.

```nim
if not isProduction():
  echo "App is running in development mode!"
```
