@echo off
set MONGO_PATH=D:\Dev\mongodb\mongodb-win32-x86_64-2.2.0\bin
for %%X in (mongod.exe) do (set MONGOD=%%~$PATH:X)
if not defined MONGOD set MONGOD=%MONGO_PATH%\mongod.exe
%MONGOD% --dbpath=db
