# Clipboard

The Clipboard API allows you to programmatically read from and write to the operating system's native clipboard.

While modern browsers have the `navigator.clipboard` API, using the native Jazzy Desktop Clipboard API guarantees that you bypass any browser-level permission restrictions or "Secure Context" (HTTPS) requirements that sometimes block clipboard access in WebViews.

## Writing to the Clipboard

To write text to the user's clipboard, you can create a simple exposed Nim function that calls the native `writeClipboard` method.

```nim title="app.nim"
import jazzy_desktop

proc copyTextToClipboard(text: string): string {.expose.} =
  writeClipboard(text)
  return "Successfully copied to clipboard!"
```

From your Javascript:

:::jazzy-snippet
action: copyToMemory
label: Copy to Clipboard
---
await jazzy.copyTextToClipboard("Hello from Jazzy!")
console.log("Copied!")
:::

## Reading from the Clipboard

You can seamlessly pull whatever text the user currently has in their clipboard back into your application.

```nim title="app.nim"
import jazzy_desktop

proc pasteFromClipboard(): string {.expose.} =
  let content = readClipboard()
  return content
```

:::jazzy-snippet
action: checkClipboard
label: Read Clipboard
---
const text = await jazzy.pasteFromClipboard()
alert("Copied: " + text)
:::

> [!NOTE]
> Currently, the Clipboard API supports plain text. Support for rich text, HTML, and Image data is planned for future releases.
