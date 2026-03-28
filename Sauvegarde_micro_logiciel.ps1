# =============================================================
# Sauvegarde_micro_logiciel.ps1  --  v7 (2026-03-28)
# Emplacement : G:\Sauvegarde_micro_logiciel\Sauvegarde_micro_logiciel.ps1
# Tache planifiee : tous les jours a 04h00
# =============================================================

Set-StrictMode -Off
$ErrorActionPreference = "Continue"

# ── CONFIGURATION ───────────────────────────────────────────────
$PROJET_DIR   = "D:\OneDrive_Perso\OneDrive\Documents\Micro_Logiciel\Documentation\Frontend\micro_logiciel_frontend_nextjs"
$DOCS_DIR     = "C:\petsuite-docs"
$LOCAL_BAK    = "C:\Backup\micro_logiciel"
$SAV_ROOT     = "G:\Sauvegarde_micro_logiciel"
$LOG_DIR      = "$SAV_ROOT\Logs"
$DUMP_DIR     = "$SAV_ROOT\BDD"
$ZIP_DIR      = "$SAV_ROOT\Projet"
$FULL_DIR     = "$SAV_ROOT\Full_Copy"
$MARIADB_DUMP = "C:\ProgramData\OptimBTP\MariaDB\bin\mariadb-dump.exe"

# Token GitHub
$GIT_TOKEN   = "RENOUVELER_ICI"
$GIT_USER    = "nicolashermilly"
$GIT_REPO    = "micro_logiciel"
$GIT_REMOTE  = "https://${GIT_USER}:${GIT_TOKEN}@github.com/${GIT_USER}/${GIT_REPO}.git"

# BDD MariaDB
$DB_HOST     = "localhost"
$DB_PORT     = "3307"
$DB_USER     = "optimbtp"
$DB_PASS     = "optimbtp"
$DB_NAMES    = @("micro_logiciel", "micro_logiciel_ged")

$DUMP_KEEP   = 30   # jours de retention dumps BDD
$ZIP_KEEP    = 14   # jours de retention zips projet
$LOG_KEEP    = 60   # jours de retention logs
$FULL_KEEP   = 30   # jours de retention Full_Copy

# ── INIT ────────────────────────────────────────────────────────
$DATE        = Get-Date -Format "yyyy-MM-dd"
$DATETIME    = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$ETAPES      = [ordered]@{}

# ── VERIFICATION DISQUE G: ───────────────────────────────────────
if (-not (Test-Path "G:\")) {
    $msg = "ERREUR CRITIQUE : Disque G:\ inaccessible. Sauvegarde annulee. $DATETIME"
    New-Item -ItemType Directory -Force -Path $LOCAL_BAK | Out-Null
    $msg | Out-File "$LOCAL_BAK\sauvegarde_erreur_$DATE.log" -Encoding UTF8
    Write-Host $msg
    exit 1
}

foreach ($dir in @($LOG_DIR, $DUMP_DIR, $ZIP_DIR, $FULL_DIR)) {
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
}

$LOG_FILE = "$LOG_DIR\sauvegarde_$DATE.log"

function Log($msg) {
    $ts   = Get-Date -Format "HH:mm:ss"
    $line = "[$ts] $msg"
    Write-Host $line
    Add-Content -Path $LOG_FILE -Value $line -Encoding UTF8
}
function Sep($t) { Log ""; Log ("=" * 60); Log "  $t"; Log ("=" * 60) }

Log "===== DEBUT SAUVEGARDE  $DATETIME ====="
Log "Machine : $env:COMPUTERNAME  |  User : $env:USERNAME"

# ── ETAPE 1 : Dump BDD ──────────────────────────────────────────
Sep "ETAPE 1 : Dump BDD MariaDB"

$dumpFiles = @()
$e1ok = $true

foreach ($db in $DB_NAMES) {
    $dumpFile = "$DUMP_DIR\${db}_$DATE.sql"
    Log "  Dump '$db' -> $dumpFile"
    try {
        $header = @(
            "SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, AUTOCOMMIT = 0;",
            "SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;",
            "SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;",
            ""
        )
        $header | Out-File -FilePath $dumpFile -Encoding UTF8

        & $MARIADB_DUMP -u $DB_USER -p"$DB_PASS" `
            --skip-opt --add-drop-table --create-options --quick `
            --skip-lock-tables --single-transaction --extended-insert `
            --set-charset $db -h $DB_HOST -P $DB_PORT -f `
            >> $dumpFile 2>&1

        $footer = @(
            "",
            "SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;",
            "SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;",
            "SET AUTOCOMMIT = @OLD_AUTOCOMMIT;"
        )
        $footer | Add-Content -Path $dumpFile -Encoding UTF8

        if ((Test-Path $dumpFile) -and (Get-Item $dumpFile).Length -gt 1024) {
            $size = [math]::Round((Get-Item $dumpFile).Length / 1KB, 1)
            Log "  [OK] $dumpFile ($size Ko)"
            $dumpFiles += $dumpFile
        } else {
            Log "  [ERR] Dump $db : fichier vide ou absent"
            $e1ok = $false
        }
    } catch {
        Log "  [ERR] EXCEPTION : $($_.Exception.Message)"
        $e1ok = $false
    }
}

if ($dumpFiles.Count -gt 0) {
    $bddZip = "$DUMP_DIR\backup_$DATE.zip"
    try {
        if (Test-Path $bddZip) { Remove-Item $bddZip -Force }
        Compress-Archive -Path $dumpFiles -DestinationPath $bddZip -Force
        $zipSize = [math]::Round((Get-Item $bddZip).Length / 1KB, 1)
        Log "  [OK] ZIP BDD : $bddZip ($zipSize Ko)"
        $dumpFiles | ForEach-Object { Remove-Item $_ -Force }
    } catch {
        Log "  [WARN] ZIP BDD echoue (SQL individuels conserves) : $($_.Exception.Message)"
    }
}

$ETAPES["1_BDD"] = if ($e1ok) {"OK"} else {"ERREUR"}

# ── ETAPE 2 : ZIP du projet (arborescence preservee) ─────────────
Sep "ETAPE 2 : Sauvegarde ZIP du projet (arborescence preservee)"

try {
    $zipFile = "$ZIP_DIR\projet_$DATE.zip"
    if (Test-Path $zipFile) { Remove-Item $zipFile -Force }

    $tmpDir = "$env:TEMP\sav_projet_$DATE"
    if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }
    New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null

    $roboDest = "$tmpDir\micro_logiciel_frontend_nextjs"
    robocopy $PROJET_DIR $roboDest /E /XD node_modules .next .git dist /NP /NFL /NDL /NJH /NJS 2>&1 | Out-Null

    Compress-Archive -Path "$tmpDir\*" -DestinationPath $zipFile -Force -ErrorAction Stop

    $size    = [math]::Round((Get-Item $zipFile).Length / 1MB, 1)
    $nbFiles = (Get-ChildItem $roboDest -Recurse -File).Count
    Log "  [OK] $zipFile ($size Mo) -- $nbFiles fichiers"

    Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
    $ETAPES["2_ZIP"] = "OK"
} catch {
    Log "  [ERR] $($_.Exception.Message)"
    $ETAPES["2_ZIP"] = "ERREUR"
}

# ── ETAPE 3 : Fichiers critiques ─────────────────────────────────
Sep "ETAPE 3 : Sauvegarde fichiers critiques"

try {
    $critDir = "$SAV_ROOT\Critiques\$DATE"
    New-Item -ItemType Directory -Path $critDir -Force | Out-Null

    $critFiles = @(
        "$PROJET_DIR\api\src\custom-routes.ts",
        "$PROJET_DIR\deploy\docker-compose.yml",
        "$PROJET_DIR\src\lib\help-content.ts"
    )
    foreach ($f in $critFiles) {
        if (Test-Path $f) {
            Copy-Item $f -Destination $critDir -Force
            Log "  [OK] $([System.IO.Path]::GetFileName($f))"
        } else {
            Log "  [---] Absent : $f"
        }
    }
    $ETAPES["3_Critiques"] = "OK"
} catch {
    Log "  [ERR] $($_.Exception.Message)"
    $ETAPES["3_Critiques"] = "ERREUR"
}

# ── ETAPE 4 : Git ────────────────────────────────────────────────
Sep "ETAPE 4 : Git commit + push GitHub"

try {
    if ($GIT_TOKEN -eq "RENOUVELER_ICI") {
        Log "  [---] Token Git non configure -- push ignore"
        $ETAPES["4_Git"] = "TOKEN_MANQUANT"
    } else {
        Set-Location $PROJET_DIR
        git remote set-url origin $GIT_REMOTE 2>&1 | Out-Null
        git add -A 2>&1 | Out-Null
        $status = git status --porcelain 2>&1
        if ($status) {
            $nb = ($status | Measure-Object).Count
            git commit -m "Sauvegarde auto $DATE - $nb fichier(s)" 2>&1 | ForEach-Object { Log "  commit: $_" }
        } else {
            Log "  Aucun changement a commiter"
        }
        $push = git push origin main 2>&1
        $push | ForEach-Object { Log "  push: $_" }
        if ($LASTEXITCODE -eq 0) {
            Log "  [OK] Push GitHub reussi"
            $ETAPES["4_Git"] = "OK"
        } else {
            Log "  [ERR] Push echoue"
            $ETAPES["4_Git"] = "ERREUR_TOKEN"
        }
    }
} catch {
    Log "  [ERR] $($_.Exception.Message)"
    $ETAPES["4_Git"] = "ERREUR"
}

# ── ETAPE 5 : Full_Copy robocopy (disc-to-disc) ──────────────────
Sep "ETAPE 5 : Full_Copy robocopy (disc-to-disc) -- retention $FULL_KEEP jours"

try {
    $fullDate = "$FULL_DIR\$DATE"
    New-Item -ItemType Directory -Path $fullDate -Force | Out-Null

    # Copie 1 : projet frontend (sans node_modules, .next, .git, dist)
    $dest1 = "$fullDate\micro_logiciel_frontend_nextjs"
    Log "  [1/3] Frontend -> $dest1"
    robocopy $PROJET_DIR $dest1 /E /XD node_modules .next .git dist /NP /NFL /NDL /NJH /NJS 2>&1 | Out-Null
    $exit1 = $LASTEXITCODE
    if ($exit1 -le 7) {
        $nb1 = (Get-ChildItem $dest1 -Recurse -File -ErrorAction SilentlyContinue).Count
        Log "  [OK] Frontend -- $nb1 fichiers (exit: $exit1)"
    } else {
        Log "  [ERR] Frontend robocopy exit: $exit1"
    }

    # Copie 2 : petsuite-docs
    $dest2 = "$fullDate\petsuite-docs"
    Log "  [2/3] petsuite-docs -> $dest2"
    robocopy $DOCS_DIR $dest2 /E /XD .git /NP /NFL /NDL /NJH /NJS 2>&1 | Out-Null
    $exit2 = $LASTEXITCODE
    if ($exit2 -le 7) {
        $nb2 = (Get-ChildItem $dest2 -Recurse -File -ErrorAction SilentlyContinue).Count
        Log "  [OK] petsuite-docs -- $nb2 fichiers (exit: $exit2)"
    } else {
        Log "  [ERR] petsuite-docs robocopy exit: $exit2"
    }

    # Copie 3 : C:\Backup\micro_logiciel (backups locaux manuels)
    $dest3 = "$fullDate\Backup_local"
    Log "  [3/3] Backup local -> $dest3"
    if (Test-Path $LOCAL_BAK) {
        robocopy $LOCAL_BAK $dest3 /E /NP /NFL /NDL /NJH /NJS 2>&1 | Out-Null
        $exit3 = $LASTEXITCODE
        if ($exit3 -le 7) {
            $nb3 = (Get-ChildItem $dest3 -Recurse -File -ErrorAction SilentlyContinue).Count
            Log "  [OK] Backup local -- $nb3 fichiers (exit: $exit3)"
        } else {
            Log "  [ERR] Backup local robocopy exit: $exit3"
        }
    } else {
        Log "  [---] $LOCAL_BAK absent -- ignore"
        $exit3 = 0
    }

    if ($exit1 -le 7 -and $exit2 -le 7 -and $exit3 -le 7) {
        $ETAPES["5_FullCopy"] = "OK"
    } else {
        $ETAPES["5_FullCopy"] = "ERREUR_PARTIELLE"
    }
} catch {
    Log "  [ERR] $($_.Exception.Message)"
    $ETAPES["5_FullCopy"] = "ERREUR"
}

# ── ETAPE 6 : Nettoyage ──────────────────────────────────────────
Sep "ETAPE 6 : Nettoyage anciens fichiers"

try {
    # Zips BDD
    Get-ChildItem "$DUMP_DIR\backup_*.zip" -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending | Select-Object -Skip $DUMP_KEEP |
        ForEach-Object { Remove-Item $_.FullName -Force; Log "  Supprime BDD : $($_.Name)" }

    # Zips projet
    Get-ChildItem "$ZIP_DIR\projet_*.zip" -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending | Select-Object -Skip $ZIP_KEEP |
        ForEach-Object { Remove-Item $_.FullName -Force; Log "  Supprime ZIP : $($_.Name)" }

    # Critiques
    Get-ChildItem "$SAV_ROOT\Critiques" -Directory -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending | Select-Object -Skip 14 |
        ForEach-Object { Remove-Item $_.FullName -Recurse -Force; Log "  Supprime critiques : $($_.Name)" }

    # Full_Copy : garder 30 derniers jours
    Get-ChildItem "$FULL_DIR" -Directory -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending | Select-Object -Skip $FULL_KEEP |
        ForEach-Object { Remove-Item $_.FullName -Recurse -Force; Log "  Supprime Full_Copy : $($_.Name)" }

    # Logs anciens
    Get-ChildItem "$LOG_DIR\sauvegarde_*.log" -ErrorAction SilentlyContinue |
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$LOG_KEEP) } |
        ForEach-Object { Remove-Item $_.FullName -Force; Log "  Log supprime : $($_.Name)" }

    Log "  [OK] Nettoyage termine"
    $ETAPES["6_Nettoyage"] = "OK"
} catch {
    Log "  [ERR] $($_.Exception.Message)"
    $ETAPES["6_Nettoyage"] = "ERREUR"
}

# ── RAPPORT FINAL ────────────────────────────────────────────────
Sep "RAPPORT FINAL"
$hasErr = $false
foreach ($e in $ETAPES.GetEnumerator()) {
    $ico = switch -Regex ($e.Value) {
        "^OK"             { "[OK] " }
        "MANQUANT|IGNORE" { "[---]" }
        default           { "[ERR]" }
    }
    Log "  $ico  $($e.Key) : $($e.Value)"
    if ($e.Value -notmatch "^(OK|TOKEN_MANQUANT|IGNORE)$") { $hasErr = $true }
}

Log ""
Log "  BDD       : $(if($ETAPES['1_BDD'] -eq 'OK'){'backup_' + $DATE + '.zip'}else{'A VERIFIER'})"
Log "  Projet    : $(if($ETAPES['2_ZIP'] -match '^OK'){'projet_' + $DATE + '.zip'}else{'A VERIFIER'})"
Log "  Full_Copy : $(if($ETAPES['5_FullCopy'] -eq 'OK'){$FULL_DIR + '\' + $DATE + ' (30j)'}else{'A VERIFIER'})"
Log ""
if ($hasErr) { Log "RESULTAT : SAUVEGARDE AVEC ERREURS -- $LOG_FILE" }
else         { Log "RESULTAT : SAUVEGARDE OK" }
Log "===== FIN  $(Get-Date -Format 'HH:mm:ss') ====="
