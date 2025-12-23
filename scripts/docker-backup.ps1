# Docker Volume Backup Script for Windows
# Backs up persistent data for Desktop <-> VPS sync
# Usage: .\scripts\docker-backup.ps1 [-BackupName <name>]

param(
    [string]$BackupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
)

$ErrorActionPreference = "Stop"

$BackupDir = ".\backups"
$DataDir = ".\data"

# Create backup directory
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

Write-Host "=== Docker Volume Backup ===" -ForegroundColor Cyan
Write-Host "Backup name: $BackupName"
Write-Host ""

function Backup-Directory {
    param([string]$Dir, [string]$Name)

    $sourcePath = Join-Path $DataDir $Dir
    $archivePath = Join-Path $BackupDir "$BackupName-$Name.zip"

    if (Test-Path $sourcePath) {
        Write-Host "Backing up $Dir..."
        Compress-Archive -Path $sourcePath -DestinationPath $archivePath -Force
        Write-Host "  -> Created: $BackupName-$Name.zip" -ForegroundColor Green
    } else {
        Write-Host "  -> Skipped: $Dir (not found)" -ForegroundColor Yellow
    }
}

# Backup all directories
Backup-Directory -Dir "postgres" -Name "postgres"
Backup-Directory -Dir "n8n" -Name "n8n"
Backup-Directory -Dir "uploads" -Name "uploads"
Backup-Directory -Dir "transcripts" -Name "transcripts"
Backup-Directory -Dir "exports" -Name "exports"

# Create manifest
$manifest = @{
    name = $BackupName
    created = (Get-Date -Format "o")
    hostname = $env:COMPUTERNAME
    files = @(
        "$BackupName-postgres.zip",
        "$BackupName-n8n.zip",
        "$BackupName-uploads.zip",
        "$BackupName-transcripts.zip",
        "$BackupName-exports.zip"
    )
} | ConvertTo-Json

$manifestPath = Join-Path $BackupDir "$BackupName-manifest.json"
$manifest | Out-File -FilePath $manifestPath -Encoding UTF8

Write-Host ""
Write-Host "=== Backup Complete ===" -ForegroundColor Cyan
Write-Host "Location: $BackupDir"
Write-Host "Manifest: $BackupName-manifest.json"
Write-Host ""
Write-Host "To transfer to VPS:" -ForegroundColor Yellow
Write-Host "  scp $BackupDir\$BackupName-*.zip user@vps:/path/to/backups/"
