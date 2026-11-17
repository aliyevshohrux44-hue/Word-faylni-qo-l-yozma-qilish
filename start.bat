@echo off
title Qo'lyozma Studio
chcp 65001 > nul
echo =======================================================
echo           QO'LYOZMA STUDIO ILovasi
echo  Word va matnlarni haqiqiy daftarga aylantirish
echo =======================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Python topildi. Server ishga tushirilmoqda...
    python run.py
) else (
    echo Python topilmadi. Sayt to'g'ridan-to'g'ri brauzerda ochilmoqda...
    start index.html
)
pause
