import jazzy
import router

proc main() =
  Jazzy.serveStatic("public")
  
  registerRoutes()
  
  Jazzy.serve(8080)

when isMainModule:
  main()
