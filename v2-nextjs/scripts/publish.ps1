param(
  [string]$Message = "chore: publish sync",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$sourceRoot = (Resolve-Path ".").Path
$publishRoot = Join-Path (Resolve-Path "..").Path "repo_publish"
$targetRoot = Join-Path $publishRoot "v2-nextjs"

if (-not (Test-Path $targetRoot)) {
  throw "Publish target not found: $targetRoot"
}

$excludeDirs = @(
  ".git",
  ".next",
  "node_modules",
  ".secrets",
  ".agents",
  ".claude",
  ".cursor",
  "docs\\ref"
)

$excludeFiles = @(
  ".env",
  ".env.local",
  "*.db",
  "*.sqlite",
  "*.sqlite3",
  "*.log",
  ".cursorrules"
)

$args = @(
  $sourceRoot,
  $targetRoot,
  "/MIR",
  "/R:2",
  "/W:1",
  "/NFL",
  "/NDL",
  "/NP"
)

if ($excludeDirs.Count -gt 0) {
  $args += "/XD"
  $args += $excludeDirs
}

if ($excludeFiles.Count -gt 0) {
  $args += "/XF"
  $args += $excludeFiles
}

if ($DryRun) {
  $args += "/L"
}

Write-Host "[sync] $sourceRoot -> $targetRoot"
robocopy @args | Out-Host
$rc = $LASTEXITCODE
if ($rc -ge 8) {
  throw "robocopy failed with exit code $rc"
}

if ($DryRun) {
  Write-Host "[dry-run] sync simulation completed."
  exit 0
}

Write-Host "[git] commit + push in $targetRoot"
$env:HOME = $sourceRoot
$env:GIT_CONFIG_NOSYSTEM = "1"
$safe = "safe.directory=$publishRoot"

git -c $safe -C $targetRoot add .
try {
  git -c $safe -C $targetRoot commit -m $Message | Out-Host
} catch {
  Write-Host "[git] nothing to commit (or commit failed)."
}

git -c $safe -C $targetRoot push origin main
Write-Host "[done] publish completed."
