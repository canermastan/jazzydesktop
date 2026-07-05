# Events & WebSockets

While [Backend Methods](/docs/backend-methods) are great for frontend-to-backend communication (Frontend asks, Backend answers), sometimes you need the **Backend to push data to the Frontend** without being asked.

This is where **Two-Way Events** come in.

Jazzy Desktop has a built-in WebSocket server that runs alongside the HTTP server. The `jazzy.js` client automatically connects to it and handles reconnections if necessary.

## Emitting Events from Nim

You can emit an event from any part of your Nim backend using the `emit()` function. You provide an event name (string) and the payload (JSON).

```nim title="app.nim"
import jazzy_desktop
import std/json
import os

proc startLongTask() {.expose.} =
  # We use spawn or just run a loop (assuming this is a background task)
  for i in 1..100:
    sleep(50) # Simulate work
    
    # Push progress to the frontend!
    emit("taskProgress", %*{
      "status": "processing",
      "percent": i
    })
    
  emit("taskProgress", %*{ "status": "done", "percent": 100 })

startDesktopApp(title = "My App")
```

## Listening for Events in JavaScript

In your frontend, you can use the `jazzy.on()` method to listen for these events.

:::tabs
== Svelte
```svelte title="App.svelte"
<script>
  import { onMount, onDestroy } from 'svelte'
  import { jazzy } from './jazzy'
  
  let progress = 0

  const handleProgress = (payload) => {
    progress = payload.percent
    if (payload.status === "done") console.log("Task finished!")
  }

  onMount(() => {
    jazzy.on("taskProgress", handleProgress)
  })

  onDestroy(() => {
    jazzy.off("taskProgress", handleProgress)
  })
</script>

<div>
  <h3>Progress: {progress}%</h3>
  <button on:click={() => jazzy.startLongTask()}>Start Task</button>
</div>
```
== React
```jsx title="App.jsx"
import { useEffect, useState } from 'react'
import { jazzy } from './jazzy'

function App() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleProgress = (payload) => {
      setProgress(payload.percent)
      if (payload.status === "done") console.log("Task finished!")
    }

    jazzy.on("taskProgress", handleProgress)
    return () => jazzy.off("taskProgress", handleProgress)
  }, [])

  return (
    <div>
      <h3>Progress: {progress}%</h3>
      <button onClick={() => jazzy.startLongTask()}>Start Task</button>
    </div>
  )
}
```
== Vue
```vue title="App.vue"
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { jazzy } from './jazzy'

const progress = ref(0)

const handleProgress = (payload) => {
  progress.value = payload.percent
  if (payload.status === "done") console.log("Task finished!")
}

onMounted(() => {
  jazzy.on("taskProgress", handleProgress)
})

onUnmounted(() => {
  jazzy.off("taskProgress", handleProgress)
})
</script>

<template>
  <div>
    <h3>Progress: {{ progress }}%</h3>
    <button @click="jazzy.startLongTask()">Start Task</button>
  </div>
</template>
```
== Solid
```jsx title="App.jsx"
import { createSignal, onMount, onCleanup } from 'solid-js'
import { jazzy } from './jazzy'

function App() {
  const [progress, setProgress] = createSignal(0)

  const handleProgress = (payload) => {
    setProgress(payload.percent)
    if (payload.status === "done") console.log("Task finished!")
  }

  onMount(() => {
    jazzy.on("taskProgress", handleProgress)
  })

  onCleanup(() => {
    jazzy.off("taskProgress", handleProgress)
  })

  return (
    <div>
      <h3>Progress: {progress()}%</h3>
      <button onClick={() => jazzy.startLongTask()}>Start Task</button>
    </div>
  )
}
```
== Vanilla
```javascript title="main.js"
import { jazzy } from './jazzy'

document.querySelector('#app').innerHTML = `
  <div>
    <h3>Progress: <span id="progress">0</span>%</h3>
    <button id="btn">Start Task</button>
  </div>
`

jazzy.on("taskProgress", (payload) => {
  document.querySelector('#progress').textContent = payload.percent
  if (payload.status === "done") console.log("Task finished!")
})

document.querySelector('#btn').addEventListener('click', () => {
  jazzy.startLongTask()
})
```
:::

> [!IMPORTANT]
> Always remember to call `jazzy.off(eventName, callback)` when your UI component unmounts (like in a React `useEffect` cleanup or Vue's `onUnmounted`). If you don't, you might create memory leaks or trigger the same callback multiple times!

## Event Payloads

The payload you send from Nim using the `%*` JSON macro can be as complex as you need it to be.

```nim
emit("userCreated", %*{
  "id": 42,
  "profile": {
    "name": "Caner",
    "role": "Admin"
  },
  "tags": ["nim", "jazzy"]
})
```

The `payload` variable in your JavaScript callback will be a perfectly parsed JavaScript object matching that exact structure.
