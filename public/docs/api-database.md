# Database & Query Builder

Since Jazzy Desktop is powered by the **Jazzy Framework**, it inherits a powerful, built-in Query Builder / ORM! This means you can easily create local SQLite databases, define schemas, and query data using an elegant, fluent Nim API without writing raw SQL.

## Connecting to the Database

You should establish your database connection when your application starts. Since desktop apps typically store databases in the user's `AppData` or `~/.config` folder, we highly recommend using the OS Helper `getAppDir()`!

```nim title="app.nim"
import jazzy_desktop
import jazzyframework
import os

proc main() =
  # 1. Get the OS-specific app data folder
  let appDir = getAppDir("MyAwesomeApp")
  let dbPath = appDir / "database.sqlite"
  
  # 2. Connect to the local SQLite database
  connectDB(dbPath)
  
  # ... start your app
  startDesktopApp(title = "My App")

when isMainModule:
  main()
```

## Creating Tables (Schema)

You can define your database schema using the `createTable` builder. It's usually best practice to run this immediately after connecting to your database to ensure the tables exist.

```nim title="schema.nim"
import jazzy_desktop

proc initSchema*() =
  # Create a users table
  createTable("users")
    .increments("id")
    .string("username")
    .string("password")
    .execute()

  # Create a todos table
  createTable("todos")
    .increments("id")
    .string("title")
    .boolean("completed", default = false)
    .execute()
```
*Note: If the tables already exist, the builder will safely skip them!*

## Querying Data

Once connected, you can use the global `DB` object from anywhere in your backend to query and manipulate data. Because it returns `JsonNode`, it pairs perfectly with Jazzy Desktop's frontend communication!

```nim title="services.nim"
import jazzy_desktop

# Fetch all records
proc getAllTodos(): JsonNode {.expose.} =
  return DB.table("todos").get()

# Fetch a single record
proc getTodo(id: int): JsonNode {.expose.} =
  return DB.table("todos").where("id", id).first()

# Insert data
proc createTodo(title: string): JsonNode {.expose.} =
  let newId = DB.table("todos").insert(%*{
    "title": title,
    "completed": 0
  })
  
  # Return the newly created record
  return getTodo(newId.int)

# Update data
proc toggleTodo(id: int, isCompleted: bool): JsonNode {.expose.} =
  DB.table("todos").where("id", id).update(%*{
    "completed": if isCompleted: 1 else: 0
  })
  return getTodo(id)

# Delete data
proc deleteTodo(id: int) {.expose.} =
  DB.table("todos").where("id", id).delete()
```

By combining the **Jazzy Query Builder** with **`getAppDir()`**, you can create incredibly robust, local-first desktop applications that manage state professionally without relying on messy JSON files!
