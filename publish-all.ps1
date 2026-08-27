<#
.SYNOPSIS
  Automates version bumping, building, and publishing all gp-ui packages to npmjs.

.DESCRIPTION
  Synchronizes versions across all monorepo packages (gp-ui, gp-ui-theme, gp-ui-icons, gp-css),
  updates CHANGELOG.md, builds all distribution bundles, and publishes them with public access.

.PARAMETER ReleaseType
  The version bump type ('patch', 'minor', 'major') or an explicit semantic version (e.g., '1.1.0').
  Defaults to 'patch'.

.PARAMETER DryRun
  If set, performs a dry-run publish without uploading packages to npmjs.

.PARAMETER SkipBump
  If set, skips version bumping and publishes the current version.

.PARAMETER SkipPublish
  If set, bumps versions and builds packages without publishing.

.EXAMPLE
  .\publish-all.ps1
  .\publish-all.ps1 minor
  .\publish-all.ps1 1.2.0 -DryRun
  .\publish-all.ps1 -DryRun
#>

[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [string]$ReleaseType = 'patch',

  [switch]$DryRun,
  [switch]$SkipBump,
  [switch]$SkipPublish
)

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  @generatedpixel Monorepo Release & Publisher" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$PackagePaths = @(
  (Join-Path $ScriptDir "package.json"),
  (Join-Path $ScriptDir "packages/gp-ui/package.json"),
  (Join-Path $ScriptDir "packages/gp-ui-theme/package.json"),
  (Join-Path $ScriptDir "packages/gp-ui-icons/package.json"),
  (Join-Path $ScriptDir "packages/gp-css/package.json")
)

# 1. Version Handling
$CorePkgPath = Join-Path $ScriptDir "packages/gp-ui/package.json"
$CorePkgContent = Get-Content -Raw $CorePkgPath
$CorePkg = ConvertFrom-Json $CorePkgContent
$CurrentVersion = $CorePkg.version

$NewVersion = $CurrentVersion
if (-not $SkipBump) {
  if ($ReleaseType -in @('patch', 'minor', 'major')) {
    $parts = $CurrentVersion.Split('.') | ForEach-Object { [int]$_ }
    if ($ReleaseType -eq 'patch') {
      $parts[2] = $parts[2] + 1
    } elseif ($ReleaseType -eq 'minor') {
      $parts[1] = $parts[1] + 1
      $parts[2] = 0
    } elseif ($ReleaseType -eq 'major') {
      $parts[0] = $parts[0] + 1
      $parts[1] = 0
      $parts[2] = 0
    }
    $NewVersion = "$($parts[0]).$($parts[1]).$($parts[2])"
  } else {
    $NewVersion = $ReleaseType
  }

  Write-Host "Current Version: $CurrentVersion" -ForegroundColor Yellow
  Write-Host "Target Version:  $NewVersion ($ReleaseType)" -ForegroundColor Green
  Write-Host ""

  # Update each package.json
  foreach ($pkgPath in $PackagePaths) {
    if (Test-Path $pkgPath) {
      $content = Get-Content -Raw $pkgPath
      # Replace version with regex to preserve file formatting
      $updated = $content -replace '"version":\s*"[^"]+"', ('"version": "' + $NewVersion + '"')
      Set-Content -Path $pkgPath -Value $updated -NoNewline
      $relPath = Resolve-Path -Relative $pkgPath
      Write-Host "  [UPDATED] $relPath -> version $NewVersion" -ForegroundColor DarkCyan
    }
  }

  # Update version.ts
  $VersionTsPath = Join-Path $ScriptDir "packages/gp-ui/src/lib/version.ts"
  if (Test-Path $VersionTsPath) {
    Set-Content -Path $VersionTsPath -Value "/**
 * Current version of the @generatedpixel/gp-ui library suite.
 */
export const GP_UI_VERSION = '$NewVersion';
" -NoNewline
    Write-Host "  [UPDATED] packages/gp-ui/src/lib/version.ts -> version $NewVersion" -ForegroundColor DarkCyan
  }

  # Sync package-lock.json
  Write-Host "  [SYNC] Updating package-lock.json..." -ForegroundColor DarkCyan
  npm install --package-lock-only --silent

  # Update CHANGELOG.md
  $ChangelogPath = Join-Path $ScriptDir "CHANGELOG.md"
  $Today = (Get-Date).ToString("yyyy-MM-dd")
  $entry = "
## [$NewVersion] - $Today
- Release of @generatedpixel gp-ui suite v$NewVersion
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css
"

  $existing = if (Test-Path $ChangelogPath) { Get-Content -Raw $ChangelogPath } else { "# Changelog
" }
  Set-Content -Path $ChangelogPath -Value ($existing + $entry) -NoNewline
  Write-Host "  [UPDATED] CHANGELOG.md" -ForegroundColor DarkCyan
  Write-Host ""
} else {
  Write-Host "Skipping version bump. Packaging version $CurrentVersion" -ForegroundColor Yellow
  Write-Host ""
}

# 2. Build Monorepo
Write-Host "Building All Monorepo Packages..." -ForegroundColor Magenta
node (Join-Path $ScriptDir "tools/build-all.js")
if ($LASTEXITCODE -ne 0) {
  Write-Error "Build failed. Halting release process."
  exit 1
}

# Copy Readme to all output packages
$DistPackages = @(
  (Join-Path $ScriptDir "dist/packages/gp-ui"),
  (Join-Path $ScriptDir "dist/packages/gp-ui-theme"),
  (Join-Path $ScriptDir "dist/packages/gp-ui-icons"),
  (Join-Path $ScriptDir "dist/packages/gp-css")
)

$ReadmePath = Join-Path $ScriptDir "README.md"
foreach ($dist in $DistPackages) {
  if (Test-Path $dist) {
    Copy-Item $ReadmePath (Join-Path $dist "README.md") -Force
  }
}

# 3. Publish to NPM
if (-not $SkipPublish) {
  Write-Host ""
  Write-Host "Publishing packages to npmjs.org..." -ForegroundColor Cyan

  $PublishFlags = @("publish", "--access", "public")
  if ($DryRun) {
    $PublishFlags += "--dry-run"
    Write-Host "DRY-RUN MODE ACTIVE: No packages will actually be published." -ForegroundColor Yellow
  }

  foreach ($dist in $DistPackages) {
    if (Test-Path $dist) {
      $distJson = Get-Content -Raw (Join-Path $dist "package.json") | ConvertFrom-Json
      $pkgName = $distJson.name
      $pkgVer = $distJson.version

      Write-Host ""
      Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
      Write-Host "Publishing $pkgName@$pkgVer from $dist..." -ForegroundColor Green
      Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray

      Push-Location $dist
      try {
        & npm @PublishFlags
        if ($LASTEXITCODE -ne 0) {
          Write-Error "Failed to publish $pkgName"
          Pop-Location
          exit 1
        }
      } finally {
        Pop-Location
      }
    }
  }

  Write-Host ""
  Write-Host "All packages processed successfully!" -ForegroundColor Green
  Write-Host "  - @generatedpixel/gp-ui@$NewVersion" -ForegroundColor Cyan
  Write-Host "  - @generatedpixel/gp-ui-theme@$NewVersion" -ForegroundColor Cyan
  Write-Host "  - @generatedpixel/gp-ui-icons@$NewVersion" -ForegroundColor Cyan
  Write-Host "  - @generatedpixel/gp-css@$NewVersion" -ForegroundColor Cyan
} else {
  Write-Host ""
  Write-Host "Publishing skipped as requested. Artifacts are ready in dist/packages/." -ForegroundColor Yellow
}
