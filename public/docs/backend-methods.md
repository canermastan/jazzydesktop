# Backend Methods (Calling Nim from JS)

The magic of Jazzy Desktop lies in how easily your frontend can communicate with your Nim backend. There's no need to manually set up routing, parse JSON, or handle HTTP boilerplate.

## The `{.expose.}` Macro

To make a Nim function available to your JavaScript frontend, all you need to do is add the `{.expose.}` pragma to your procedure in `src/app.nim`.

```nim title="app.nim"
import jazzy_desktop

# A simple function that takes parameters and returns a string
proc sayHello(name: string, age: int): string {.expose.} =
  "Hello " & name & ", you are " & $age & " years old!"

# A function that handles a heavy task
proc calculateHash(data: string): string {.expose.} =
  # Heavy CPU work...
  return "hash_result_123"

startDesktopApp(title = "My App")
```

Behind the scenes, the `{.expose.}` macro automatically generates a secure HTTP POST endpoint for this function.

## Calling from the Frontend

When you scaffold a project, the CLI automatically generates a `jazzy.js` (or `.ts`) file in your frontend folder. This file exports a dynamic `jazzy` proxy object.

To call your Nim function, you just call it as if it were a normal JavaScript function!

:::tabs
== Svelte
```svelte title="App.svelte"
<script>
  import { jazzy } from './jazzy'
  let msg = ""

  const handleClick = async () => {
    try {
      msg = await jazzy.sayHello("Developer", 99)
    } catch (err) {
      console.error(err)
    }
  }
</script>

<div>
  <p>{msg}</p>
  <button on:click={handleClick}>Say Hello</button>
</div>
```
== React
```jsx title="App.jsx"
import { useState } from 'react'
import { jazzy } from './jazzy'

function App() {
  const [msg, setMsg] = useState("")

  const handleClick = async () => {
    try {
      const response = await jazzy.sayHello("Developer", 99)
      setMsg(response)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <p>{msg}</p>
      <button onClick={handleClick}>Say Hello</button>
    </div>
  )
}
```
== Vue
```vue title="App.vue"
<script setup>
import { ref } from 'vue'
import { jazzy } from './jazzy'

const msg = ref("")

const handleClick = async () => {
  try {
    msg.value = await jazzy.sayHello("Developer", 99)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div>
    <p>{{ msg }}</p>
    <button @click="handleClick">Say Hello</button>
  </div>
</template>
```
== Solid
```jsx title="App.jsx"
import { createSignal } from 'solid-js'
import { jazzy } from './jazzy'

function App() {
  const [msg, setMsg] = createSignal("")

  const handleClick = async () => {
    try {
      const response = await jazzy.sayHello("Developer", 99)
      setMsg(response)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <p>{msg()}</p>
      <button onClick={handleClick}>Say Hello</button>
    </div>
  )
}
```
== Vanilla
```javascript title="main.js"
import { jazzy } from './jazzy'

document.querySelector('#app').innerHTML = `
  <div>
    <p id="msg"></p>
    <button id="btn">Say Hello</button>
  </div>
`

document.querySelector('#btn').addEventListener('click', async () => {
  try {
    const response = await jazzy.sayHello("Developer", 99)
    document.querySelector('#msg').textContent = response
  } catch (err) {
    console.error(err)
  }
})
```
:::

## Understanding the Thread Model

If you have experience with Node.js or Python (FastAPI/Tornado), you might be asking: *"Wait, what if my Nim function takes 5 seconds to run? Do I need to make it asynchronous (`async/await`) to prevent the UI from freezing?"*

**The short answer is: NO.**

### How Jazzy Desktop Handles Threads

Jazzy Desktop runs the WebView (your frontend) and the HTTP Server (your backend) on entirely separate threads using Nim's powerful multi-threading capabilities.

- **Thread 1 (UI Thread):** Runs the OS-native WebView window. It's completely non-blocking.
- **Thread 2 (Server Thread):** Runs the Jazzy HTTP server.

Because of this architecture, you can write simple, **synchronous** blocking code in your Nim backend!

```nim title="app.nim"
import os

proc heavyDatabaseQuery(): string {.expose.} =
  # Let's intentionally block the thread for 5 seconds
  sleep(5000) 
  return "Data loaded!"
```

Even though `sleep(5000)` blocks the backend server thread, **your React/Vue UI will remain perfectly smooth and responsive**. The user can still click buttons, CSS animations will still play, and the window can still be dragged around.

> [!TIP]
> Keep your code simple! You only need to use `{.async.}` in Nim if you are making concurrent network requests or if you specifically want to use asynchronous Nim libraries. For standard desktop operations (file reading, DB queries), synchronous code is perfectly fine and often faster!



## Custom Routes (Advanced)

Since Jazzy Desktop is built directly on top of the **Jazzy Framework**, the `{.expose.}` macro is actually just a convenient wrapper that automatically registers a `Route.post("/rpc/...")` endpoint for you!

If you are building a more complex application and need full control over your backend (for example, to handle file uploads via `multipart/form-data`, create a standard REST API for third-party clients, or serve raw files), you can completely bypass the macro and write raw Jazzy Framework routes.

```nim title="app.nim"
import jazzy_desktop
import jazzyframework

# 1. Standard Jazzy Desktop RPC
proc sayHello(): string {.expose.} =
  return "Hello from RPC!"

# 2. Raw Jazzy Framework Routes
Route.get("/api/status", proc(ctx: Context) {.async.} =
  ctx.json(%*{"status": "running", "version": "1.0.0"})
)

Route.post("/api/upload", proc(ctx: Context) {.async.} =
  # Handle complex file uploads manually
  let file = ctx.file("document")
  ctx.text("File received: " & file.filename)
)

startDesktopApp(title = "My App")
```

Your desktop frontend can still make standard `fetch()` calls to these raw endpoints, exactly like a normal web application!
