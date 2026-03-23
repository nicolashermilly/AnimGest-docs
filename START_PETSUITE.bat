@echo off
:: =============================================================
:: START_PETSUITE.bat
:: Démarre la stack PetSuite complète après reboot Windows
:: - Attend Docker Desktop
:: - Lance docker compose up -d
:: - Attend NestJS
:: - Injecte inject_v6_petsuite.js automatiquement
::
:: Usage manuel    : double-clic ou exécuter en admin
:: Tâche planifiée : au démarrage de session, délai 60s
:: =============================================================

setlocal
set DEPLOY=D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs\deploy
set INJECT=%USERPROFILE%\Downloads\inject_v6_petsuite.js
set LOG=C:\Backup\micro_logiciel\startup_log.txt
set API_URL=http://localhost/api/tiers?limit=1

echo [%date% %time%] === DEMARRAGE PETSUITE === >> %LOG%
echo [%date% %time%] DEMARRAGE PETSUITE >> %LOG%

:: ── Étape 1 : Attendre Docker Desktop ──────────────────────
echo [1/5] Attente Docker Desktop...
echo [%date% %time%] Attente Docker Desktop... >> %LOG%

set /a DOCKER_WAIT=0
:WAIT_DOCKER
docker info >nul 2>&1
if %errorlevel%==0 goto DOCKER_OK
set /a DOCKER_WAIT+=1
if %DOCKER_WAIT% gtr 60 (
    echo ERREUR: Docker non disponible apres 5 minutes
    echo [%date% %time%] ERREUR: Docker timeout >> %LOG%
    goto END
)
echo   Docker pas encore pret, attente 5s... (%DOCKER_WAIT%/60)
timeout /t 5 /nobreak >nul
goto WAIT_DOCKER

:DOCKER_OK
echo   Docker OK
echo [%date% %time%] Docker OK >> %LOG%

:: ── Étape 2 : docker compose up ────────────────────────────
echo [2/5] Lancement docker compose...
echo [%date% %time%] docker compose up -d >> %LOG%

cd /d %DEPLOY%
docker compose up -d >> %LOG% 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: docker compose up failed
    echo [%date% %time%] ERREUR docker compose up >> %LOG%
    goto END
)
echo   Conteneurs demarres

:: ── Étape 3 : Attendre NestJS ──────────────────────────────
echo [3/5] Attente NestJS API...
echo [%date% %time%] Attente NestJS... >> %LOG%

set /a NEST_WAIT=0
:WAIT_NESTJS
timeout /t 5 /nobreak >nul
docker logs micro_api --tail 3 2>&1 | findstr /i "successfully started" >nul
if %errorlevel%==0 goto NESTJS_OK
set /a NEST_WAIT+=1
if %NEST_WAIT% gtr 24 (
    echo ATTENTION: NestJS pas confirme apres 2 minutes - injection quand meme
    echo [%date% %time%] ATTENTION: NestJS timeout >> %LOG%
    goto DO_INJECT
)
echo   Attente NestJS... (%NEST_WAIT%/24)
goto WAIT_NESTJS

:NESTJS_OK
echo   NestJS UP
echo [%date% %time%] NestJS UP >> %LOG%

:: ── Étape 4 : Injection routes ─────────────────────────────
:DO_INJECT
echo [4/5] Injection routes API...
echo [%date% %time%] Injection v6... >> %LOG%

if not exist "%INJECT%" (
    echo ATTENTION: inject_v6_petsuite.js absent de Downloads - injection ignoree
    echo [%date% %time%] ATTENTION: inject_v6 absent >> %LOG%
    goto CHECK_API
)

docker cp "%INJECT%" micro_api:/tmp/inject_v6_petsuite.js
docker exec micro_api node /tmp/inject_v6_petsuite.js >> %LOG% 2>&1
if %errorlevel%==0 (
    echo   Injection OK
    echo [%date% %time%] Injection OK >> %LOG%
) else (
    echo   ERREUR injection
    echo [%date% %time%] ERREUR injection >> %LOG%
)

:: ── Étape 5 : Vérification finale ──────────────────────────
:CHECK_API
echo [5/5] Verification API...
timeout /t 5 /nobreak >nul

curl -s -o nul -w "%%{http_code}" %API_URL% > %TEMP%\petsuite_check.txt 2>&1
set /p HTTP_CODE=<%TEMP%\petsuite_check.txt

if "%HTTP_CODE%"=="200" (
    echo   API OK [200] - PetSuite operationnel
    echo [%date% %time%] API OK [200] >> %LOG%
) else (
    echo   ATTENTION: API repond [%HTTP_CODE%] - verifier manuellement
    echo [%date% %time%] ATTENTION: API [%HTTP_CODE%] >> %LOG%
)

:END
echo.
echo [%date% %time%] === FIN DEMARRAGE === >> %LOG%
echo Demarrage termine. Log : %LOG%
echo.
endlocal
