@echo off
setlocal enabledelayedexpansion

REM Get current date and time for the filename
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"

set "timestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"
set "output_file=compiled-code %timestamp%.txt"

REM Create the output file with a header
echo Compiled Code - %timestamp% > "%output_file%"
echo. >> "%output_file%"

REM Process JavaScript files
echo ================================================================================ >> "%output_file%"
echo SOURCE FILES IN JS DIRECTORY >> "%output_file%"
echo ================================================================================ >> "%output_file%"
echo. >> "%output_file%"

for %%f in (js\*.js) do (
    echo ---------------------------------------- >> "%output_file%"
    echo FILE: %%f >> "%output_file%"
    echo ---------------------------------------- >> "%output_file%"
    echo. >> "%output_file%"
    type "%%f" >> "%output_file%"
    echo. >> "%output_file%"
    echo. >> "%output_file%"
)

REM Process CSS files
echo ================================================================================ >> "%output_file%"
echo SOURCE FILES IN CSS DIRECTORY >> "%output_file%"
echo ================================================================================ >> "%output_file%"
echo. >> "%output_file%"

for %%f in (css\*.css) do (
    echo ---------------------------------------- >> "%output_file%"
    echo FILE: %%f >> "%output_file%"
    echo ---------------------------------------- >> "%output_file%"
    echo. >> "%output_file%"
    type "%%f" >> "%output_file%"
    echo. >> "%output_file%"
    echo. >> "%output_file%"
)

REM Process HTML files
echo ================================================================================ >> "%output_file%"
echo HTML FILES IN ROOT DIRECTORY >> "%output_file%"
echo ================================================================================ >> "%output_file%"
echo. >> "%output_file%"

for %%f in (*.html) do (
    echo ---------------------------------------- >> "%output_file%"
    echo FILE: %%f >> "%output_file%"
    echo ---------------------------------------- >> "%output_file%"
    echo. >> "%output_file%"
    type "%%f" >> "%output_file%"
    echo. >> "%output_file%"
    echo. >> "%output_file%"
)

REM Process memory bank files
echo ================================================================================ >> "%output_file%"
echo MEMORY BANK FILES >> "%output_file%"
echo ================================================================================ >> "%output_file%"
echo. >> "%output_file%"

for %%f in ("memory bank\*.*") do (
    echo ---------------------------------------- >> "%output_file%"
    echo FILE: %%f >> "%output_file%"
    echo ---------------------------------------- >> "%output_file%"
    echo. >> "%output_file%"
    type "%%f" >> "%output_file%"
    echo. >> "%output_file%"
    echo. >> "%output_file%"
)

echo Compilation complete! Output saved to: %output_file% 