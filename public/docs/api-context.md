# Context API

Under the hood, Jazzy Desktop is powered by the **Jazzy Framework**, a lightweight and fast HTTP framework for Nim. Because your frontend communicates with the backend via a local HTTP server, every backend method you expose is essentially handling an HTTP request.

Sometimes, you need to access details about the underlying request, such as the client's IP address, headers, or you might want to use the request context to pass around database connections or cache instances.

You can do this by injecting the `Context` object into your exposed methods!

## Using the Context

To access the Context, simply add `ctx: Context` as the **first parameter** of your exposed Nim proc. Jazzy Desktop will automatically detect it and inject the current request context when the method is called from the frontend.

```nim title="app.nim"
import jazzy_desktop
import jazzyframework

proc getClientInfo(ctx: Context): string {.expose.} =
  # Access underlying HTTP request information
  let ip = ctx.request.ip
  return "Hello! Your local IP is: " & ip
```

:::jazzy-snippet
action: handleGetInfo
label: Get Client Info
---
const info = await jazzy.getClientInfo()
alert(info)
:::

## Available Context Properties

The `Context` object provides many useful properties:

- `ctx.request.params`: Access URL query strings or route parameters (if defined).
- `ctx.request.ip`: The local IP address making the request (usually `127.0.0.1` in desktop apps).
- `ctx.request.headers`: Access any custom HTTP headers sent by the frontend's native fetch.

For full details on what the `Context` object can do, check out the official [Jazzy Framework Context Documentation](https://canermastan.github.io/jazzyframework/en/context/).
