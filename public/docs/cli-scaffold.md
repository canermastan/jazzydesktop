# The CLI & Scaffold

The `jazzyd` CLI is your best friend. It handles creating projects, managing the development environment (Hot Module Replacement), and building your final application.

## Creating a New Project

To create a new Jazzy Desktop application, open your terminal and run the `new` command followed by your project's name:

```bash title="Terminal"
jazzyd new my-app
```

The CLI will launch an interactive wizard that asks you a few simple questions to set up the perfect environment for you.

### 1. Choosing a UI Library
First, you'll be asked which frontend framework you want to use. We leverage **Vite** under the hood, ensuring lightning-fast frontend compilation.

```text title="Terminal Output"
Which UI library would you like to use?
1. Svelte (Recommended for simplicity)
2. React
3. SolidJS
4. Vue
5. Vanilla JS
Your choice (1-5):
```

### 2. TypeScript Support
Next, the CLI will ask if you want to use TypeScript in your frontend. 

```text title="Terminal Output"
Would you like to use TypeScript?
1. Yes
2. No
Your choice (1-2):
```

Once you make your selections, the CLI will:
1. Scaffold the Vite project inside the `frontend` folder.
2. Generate the Nim backend skeleton in the `src` folder.
3. Automatically inject the `jazzy.js` or `jazzy.ts` proxy files so your frontend can communicate with the backend.
4. Run `npm install` for you.

> [!TIP]
> **Why Svelte?**
> We highly recommend Svelte! Its compiler-based approach and lack of Virtual DOM pairs beautifully with the performance-first mindset of Nim and Jazzy Desktop.

## Starting the Development Server

Navigate into your newly created project directory:

```bash title="Terminal"
cd my-app
```

To start developing, simply run:

```bash title="Terminal"
jazzyd dev
```

### What happens during `jazzyd dev`?
This single command does a lot of magic:
- It starts the **Vite dev server** for your frontend (giving you instant Hot-Reloading for your UI).
- It watches your `src/*.nim` files.
- It compiles and runs your Nim backend.
- It opens the native Desktop Window.

If you change a `.css` or `.jsx` file, the UI updates instantly. If you change a `.nim` file, the CLI safely terminates the backend and recompiles it in milliseconds without breaking the frontend Vite server!

### Web-based Development (`--web`)

Since Jazzy Desktop runs a full HTTP server under the hood, you can actually build and run your desktop app as a standard Web Application! If you prefer to use your own browser (like Chrome or Firefox) during development to access their DevTools, you can pass the `--web` flag:

```bash title="Terminal"
jazzyd dev --web
```

When you use this flag, the CLI will start the backend and frontend servers as usual, but it **will not** spawn the native OS desktop window. Instead, you can simply open `http://localhost:5173` (or whatever port Vite gives you) in your browser and develop your app there! 

You're now running your first Jazzy Desktop app. In the next section, we'll learn how to write backend logic using [Backend Methods](/docs/backend-methods).
