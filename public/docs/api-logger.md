# Logger

Jazzy Desktop comes with a lightweight, built-in file logging system. It allows you to log application events, errors, and debug information directly to a log file on the user's computer, while also printing them to the terminal during development.

## Initialization

Before using the logger, you should initialize it. We highly recommend using the OS Utilities `getLogDir()` to ensure your logs are saved in the correct standard directory for the user's operating system.

```nim title="app.nim"
import jazzy_desktop

# Initialize the logger in the app's standard log directory
let logPath = getLogDir("MyAwesomeApp") / "app.log"
initLogger(logPath)

startDesktopApp(title = "My App")
```

## Logging Messages

You can log messages with different severity levels using the convenience procs: `logInfo`, `logWarn`, `logError`, and `logDebug`.

```nim
proc performLogin(username: string) {.expose.} =
  logInfo("Attempting login for user: " & username)
  
  if username == "":
    logError("Login failed: Username was empty")
    return
    
  logDebug("Database query took 42ms")
```

## Output Format

When you log a message, Jazzy automatically prepends the current timestamp and the severity level.

Inside `app.log`, the output will look like this:
```text
--- Jazzy Desktop Log Started at 2026-07-05T13:10:00+03:00 ---
2026-07-05 13:10:01 [INFO] Attempting login for user: admin
2026-07-05 13:10:01 [DEBUG] Database query took 42ms
2026-07-05 13:10:05 [ERROR] Login failed: Network timeout
```

> [!TIP]
> The logger automatically appends to the log file instead of overwriting it, so past logs are not lost if the app restarts. During development, these logs are also printed directly to your terminal!
