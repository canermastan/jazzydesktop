# Browser

The Browser API provides a simple native command to open URLs in the user's **default external web browser** (like Google Chrome, Safari, or Microsoft Edge), rather than opening them inside your application's WebView window.

This is extremely important for external links, OAuth login flows, or opening local files.

## Opening a URL

To open a webpage in the default browser, expose a function that calls `openBrowser()`:

```nim title="app.nim"
import jazzy_desktop

proc openExternalLink(url: string) {.expose.} =
  openBrowser(url)
```

In your frontend, you can now safely open links without trapping the user inside your WebView:

:::jazzy-snippet
action: openExternal
label: Open GitHub in Chrome
---
jazzy.openExternalLink("https://github.com")
:::

> [!IMPORTANT]
> If you simply use `<a href="https://github.com">` in your React or Vue code, the WebView will navigate away from your app to that webpage, effectively "breaking" your desktop application until the user finds a way to go back. Always use the `openBrowser` API for external links!
