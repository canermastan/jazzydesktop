# This file fixes IDE support for Nimble packages
import std/os

let nimbleDir = getHomeDir() / ".nimble"
let pkgs2Dir = nimbleDir / "pkgs2"

if dirExists(pkgs2Dir):
  for kind, path in walkDir(pkgs2Dir):
    if kind == pcDir:
      switch("path", path)
