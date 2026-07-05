import jazzy
import markdown
import std/os
import std/strutils
import std/json

proc getDocTitle(content: string): string =
  for line in content.splitLines():
    if line.startsWith("# "):
      return line[2..^1]
  return "Jazzy Desktop Documentation"

proc generateSitemap(): string =
  var sitemap = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">"""
  let sidebarPath = "public/docs/sidebar.json"
  if fileExists(sidebarPath):
    try:
      let sidebar = parseJson(readFile(sidebarPath))
      for cat in sidebar.getElems():
        for item in cat["items"].getElems():
          let path = item["path"].getStr()
          sitemap &= "\n  <url>\n    <loc>https://canermastan.github.io/jazzydesktop/docs/" & path & "</loc>\n  </url>"
    except:
      discard
  sitemap &= "\n</urlset>"
  return sitemap

proc registerRoutes*() =
  Route.get("/", proc(ctx: Context) {.async.} =
    ctx.render("index", %*{"title": "Build Modern Desktop Apps with Nim"})
  )
  
  Route.get("/sitemap.xml", proc(ctx: Context) {.async.} =
    ctx.header("Content-Type", "application/xml")
    ctx.response.body = generateSitemap()
  )
  
  Route.get("/robots.txt", proc(ctx: Context) {.async.} =
    ctx.text("User-agent: *\nSitemap: https://canermastan.github.io/jazzydesktop/sitemap.xml")
  )
  
  Route.get("/docs", proc(ctx: Context) {.async.} =
    ctx.redirect("/docs/getting-started")
  )
  
  Route.get("/docs/:page", proc(ctx: Context) {.async.} =
    let page = ctx.param("page", "getting-started")
    let mdPath = "public/docs/" & page & ".md"
    
    var htmlContent = ""
    var docTitle = "Not Found"
    if fileExists(mdPath):
      let mdContent = readFile(mdPath)
      docTitle = getDocTitle(mdContent)
      htmlContent = markdown(mdContent)
    else:
      htmlContent = "<h1>404 Not Found</h1><p>The documentation page you are looking for does not exist.</p>"
      
    ctx.render("docs", %*{"content": htmlContent, "title": docTitle})
  )
