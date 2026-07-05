import std/[os, strutils, json]
import jazzy/views/engine

proc buildStatic() =
  echo "Building static site..."
  
  # Ensure dist directory exists and is clean (preserving .git)
  if not dirExists("dist"):
    createDir("dist")
  else:
    for kind, path in walkDir("dist"):
      let name = extractFilename(path)
      if name != ".git":
        if kind == pcDir: removeDir(path)
        else: removeFile(path)
  createDir("dist/docs")
  
  # Copy public folder
  echo "Copying public assets..."
  copyDir("public", "dist/public")
  
  writeFile("dist/robots.txt", "User-agent: *\nAllow: /")

  # Render index.html
  echo "Rendering index.html..."
  let indexTmpl = readFile("views/index.html")
  let indexHtml = engine.renderString(indexTmpl, %*{"title": "Build Modern Desktop Apps with Nim"}, "views")
  writeFile("dist/index.html", indexHtml)
  
  # Render docs.html as 404.html (for GitHub Pages SPA routing)
  echo "Rendering 404.html (Docs SPA wrapper)..."
  let docsTmpl = readFile("views/docs.html")
  let docsHtml = engine.renderString(docsTmpl, %*{"title": "Jazzy Desktop Documentation", "content": ""}, "views")
  writeFile("dist/404.html", docsHtml)

  echo "Build complete! The 'dist' directory is ready for GitHub Pages."

when isMainModule:
  buildStatic()
