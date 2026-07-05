# Installation

Before building desktop applications with Jazzy Desktop, you need to ensure a few dependencies are installed on your machine.

## Prerequisites

To get the most out of the framework, we recommend installing the following:

1. **Nim Compiler** (v2.0.0 or higher)
   - Nim is the incredibly fast language that powers your backend.
   - You can download it from the [official Nim website](https://nim-lang.org/install.html) or use `choosenim`.
   
2. **Node.js** (Optional, but highly recommended)
   - Node.js is required if you want to use modern frontend frameworks like React, Vue, Svelte, or SolidJS with Vite.
   - If you plan on writing pure Vanilla JS, Node is not strictly required, but the `jazzyd` CLI heavily relies on NPM for scaffolding.

3. **C/C++ Compiler & OS Dependencies**
   - **Windows:** Install MinGW (usually comes bundled with the Nim Windows installer).
   - **Linux:** You will need GCC and the WebKit2GTK development headers. Run: `sudo apt install build-essential libgtk-3-dev libwebkit2gtk-4.1-dev` (or `-4.0-dev` depending on your distro).
   - **macOS (Coming Soon):** macOS support is currently under active development. Once released, you will need Xcode Command Line Tools (`xcode-select --install`).

> [!TIP]
> **Check your installation!**
> Open your terminal and run `nim -v`. If you see the version output (2.0.0+), you're ready to go!

## Installing the Jazzy Desktop CLI

Once Nim is installed, it comes with a package manager called `nimble`. You can use it to globally install the Jazzy Desktop CLI tool (`jazzyd`).

```bash title="Terminal"
nimble install jazzy_desktop
```

This command downloads the framework, compiles the CLI tool, and adds `jazzyd` to your PATH.

> [!IMPORTANT]
> If your terminal says `jazzyd: command not found` after successful installation, ensure that the Nimble binary path (e.g., `~/.nimble/bin` on Unix or `C:\Users\YourUser\.nimble\bin` on Windows) is added to your system's `PATH` environment variable.

## Next Steps

Now that you have the CLI installed, it's time to build your first app! Head over to the [CLI & Scaffold](/docs/cli-scaffold) page.
