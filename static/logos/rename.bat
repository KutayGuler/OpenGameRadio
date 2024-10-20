@echo off
setlocal EnableDelayedExpansion
for %%f in (*_col.png) do (
    set "filename=%%~nf"
    set "newname=!filename:_col=!.png"
    ren "%%f" "!newname!"
)
