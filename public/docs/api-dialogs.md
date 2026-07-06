# System Dialogs

The Dialogs API allows you to open native operating system file pickers, folder selectors, and message boxes.

Because these dialogs are triggered via your Nim backend, they use the exact native UI of the underlying operating system (e.g., the Windows Explorer File Picker on Windows).

## Opening a File Dialog

You can create a custom backend method to open a file dialog, restricting the user to specific file extensions.

```nim title="app.nim"
import jazzy_desktop

proc pickImage(): string {.expose.} =
  # The selectFileDialog takes: (title, filters, forSave)
  let filePath = selectFileDialog(
    "Select an Image", 
    @[DialogFilter(name: "Images", extensions: "*.png;*.jpg;*.jpeg")], 
    false # forSave = false (opens a file selection dialog)
  )
  
  if filePath == "":
    return "User canceled the selection"
    
  return "You selected: " & filePath
```

You can then call this from your JavaScript frontend just like any other method:

:::jazzy-snippet
action: handleFilePick
label: Pick Image
---
const result = await jazzy.pickImage()
console.log(result)
:::

## Saving a File

You can also use the same `selectFileDialog` to open a "Save As" dialog by passing `forSave = true`. This is perfect for export functionality or saving documents.

```nim title="app.nim"
import jazzy_desktop
import std/strutils

proc saveReport(content: string): string {.expose.} =
  let savePath = selectFileDialog(
    "Save Report As...", 
    @[DialogFilter(name: "Text File", extensions: "*.txt")], 
    forSave = true
  )
  
  if savePath == "":
    return "Save canceled."
    
  # Write the content to the selected path
  writeFile(savePath, content)
  return "Saved successfully to " & savePath
```

:::jazzy-snippet
action: handleSave
label: Save Report
---
const result = await jazzy.saveReport("Report Data: 100% efficiency!")
alert(result)
:::

## Opening a Folder Dialog

If you need the user to select a directory instead of a file, you can use the native folder picker.

```nim title="app.nim"
import jazzy_desktop

proc pickProjectFolder(): string {.expose.} =
  # selectFolderDialog takes a title string
  let folderPath = selectFolderDialog("Choose a destination folder")
  return folderPath
```

> [!NOTE]
> Dialog windows are modal, meaning they will block the user from interacting with the main app window until they select a file or click Cancel. However, since the Jazzy backend runs on a separate thread, your UI animations will continue to play smoothly in the background!
