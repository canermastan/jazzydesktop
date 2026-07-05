# Build & Deployment

When you're ready to share your masterpiece with the world, Jazzy Desktop makes the build process incredibly simple. 

## Compiling for Production

To create a single executable file containing both your backend logic and your frontend UI, run the following command in your project root:

```bash title="Terminal"
jazzyd build
```

This command performs several actions behind the scenes:
1. **Frontend Build:** It runs `npm run build` in your `frontend/` directory (compiling Vite to static assets).
2. **VFS Injection:** It bundles the resulting HTML, JS, CSS, and images into a Virtual File System (VFS).
3. **Nim Compilation:** It compiles your Nim backend using the `-d:release` flag (which applies aggressive C compiler optimizations).
4. **Asset Embedding:** It injects the VFS directly into the compiled executable byte-by-byte.

The result? A single `.exe` (or binary on Mac/Linux) file inside your `bin/` directory. No folders, no NodeJS runtime, no DLLs required!

> [!TIP]
> **Custom Application Icons**
> If you place an `app_icon.ico` file in your project root, `jazzyd build` will automatically embed it into your Windows `.exe` using `windres`!

## Web Build (`--web`)

Jazzy Desktop has a unique superpower: **Any desktop application you build can be compiled into a standard Web Application without changing a single line of code.**

If you want to host your app on a Linux VPS or cloud provider, simply run:

```bash title="Terminal"
jazzyd build --web
```

When you run the resulting binary on your server, it will not attempt to open a GUI window. Instead, it will start a highly concurrent HTTP server on port `7654` (or whatever you configured), serving your frontend via standard HTTP. You can then put it behind Nginx or Apache.

> [!NOTE]
> When running in `--web` mode, Native OS features like `clipboard`, `tray`, or `dialogs` will either be ignored or return empty values, as the server running the code does not have a local user interface. Ensure your app handles gracefully if you intend to deploy hybrid apps!
