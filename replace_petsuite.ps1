# ============================================================
# replace_petsuite.ps1 — PetSuite → Anim'Gest
# Repo : C:\petsuite-docs
# ============================================================

$ErrorActionPreference = "Stop"
$RepoPath = "C:\petsuite-docs"

Set-Location $RepoPath

$htmlFiles = Get-ChildItem -Recurse -Filter "*.html" |
             Where-Object { $_.FullName -notmatch '\\\.git\\' }

Write-Host ""
Write-Host "=== Remplacement PetSuite → Anim'Gest / Algorithmia → NoSage's Editor ===" -ForegroundColor Cyan
Write-Host "Dossier    : $RepoPath"
Write-Host "Fichiers   : $($htmlFiles.Count) fichiers HTML detectes"
Write-Host ""

$totalModified = 0
$filesModified  = @()

foreach ($file in $htmlFiles) {
    $original = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $updated  = $original

    $updated = $updated -replace "Pet<span>Suite</span>",  "Anim'<span>Gest</span>"
    $updated = $updated -replace "PetSuite",               "Anim'Gest"
    $updated = $updated -replace "Algorithmia",            "NoSage's Editor"
    $updated = $updated -replace "micro_logiciel",         "anim_gest"

    if ($updated -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $updated, [System.Text.Encoding]::UTF8)
        $totalModified++
        $filesModified += $file.Name
        Write-Host "  OK  $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  --  $($file.Name)  (inchange)" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Fichiers modifies : $totalModified / $($htmlFiles.Count)" -ForegroundColor Yellow
Write-Host ""

if ($totalModified -gt 0) {
    Write-Host "=== Git commit + push ===" -ForegroundColor Cyan
    git add -A
    git commit -m "refactor: PetSuite -> Anim'Gest, Algorithmia -> NoSage's Editor (toutes pages HTML)"
    git push
    Write-Host ""
    Write-Host "Commit pousse avec succes." -ForegroundColor Green
} else {
    Write-Host "Aucune modification - rien a pousser." -ForegroundColor Yellow
}
