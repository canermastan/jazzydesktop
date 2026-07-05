# Introduction to Jazzy Desktop

Welcome to **Jazzy Desktop**! This next-generation framework allows you to build incredibly fast, cross-platform modern desktop applications using the **Nim** programming language and web technologies (WebViews).

If you love the simplicity of web development but need the performance, low memory footprint, and native OS capabilities of a true desktop app, you are in the right place.

> [!NOTE]
> **Why Jazzy Desktop?**
> You might be wondering: "Why not use an existing Nim GUI library?" 
> Because Jazzy Desktop allows you to use **modern web technologies** (Tailwind, React, Svelte) to build stunning, futuristic interfaces instead of being stuck with old-school, dated native controls. And unlike Electron, it relies on the OS's native WebView, resulting in extremely small binary sizes (often under 5MB) and lightning-fast startup times.

## Supported Platforms

Currently, Jazzy Desktop supports:
- **Windows** (WebView2)
- **Linux** (WebKit2GTK)
- **macOS** *(Coming soon!)*

## Core Philosophy

Jazzy Desktop is designed with Developer Experience (DX) as its absolute priority. 
We believe that connecting your frontend UI to your backend logic should be seamless, type-safe, and require zero boilerplate.

- **Familiar Frontend:** Build your UI using your favorite framework (React, Vue, Svelte, SolidJS, or Vanilla).
- **Powerful Backend:** Write your heavy logic in Nim—a language that reads like Python but compiles down to hyper-optimized C/C++.
- **Seamless RPC:** Call Nim functions directly from JavaScript as if they were local functions.
- **No Async Headaches:** Your Nim backend runs the HTTP/RPC server in a separate thread. This means your UI will **never freeze**, even if you run a heavy, synchronous database query in Nim!

## The Architecture

Under the hood, Jazzy Desktop runs a highly optimized local HTTP server (`jazzy`) to serve your assets and handle RPC (Remote Procedure Calls) via WebSockets and HTTP POST requests. 

1. **The UI Thread:** The OS-native window that renders your frontend.
2. **The Server Thread:** The Nim backend running independently, instantly fulfilling requests from your UI.

Because they are separated, you can write simple, synchronous backend code without worrying about complex `async/await` flows or blocking the user interface.

## Ready to dive in?

Let's move on to [Installation](/docs/installation) to get your machine ready, or jump straight into the [CLI & Scaffold](/docs/cli-scaffold) to create your first app.
