$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

$env:Path = "E:\dev\nodejs;E:\dev\npm-global;E:\dev\Git\cmd;" + $env:Path

Write-Host "==> Building production dist..."
pnpm run build
Copy-Item -Force "$RepoRoot\dist\index.html" "$RepoRoot\dist\404.html"

if (Test-Path "$RepoRoot\dist-upload.zip") {
  Remove-Item "$RepoRoot\dist-upload.zip" -Force
}

Write-Host "==> Creating upload zip..."
Compress-Archive -Path "$RepoRoot\dist\*" -DestinationPath "$RepoRoot\dist-upload.zip" -Force

Write-Host ""
Write-Host "Ready for CloudBase upload:"
Write-Host "  Folder: $RepoRoot\dist"
Write-Host "  Zip:    $RepoRoot\dist-upload.zip"
Write-Host ""
Write-Host "Optional CLI deploy (after: npm i -g @cloudbase/cli && tcb login):"
Write-Host "  tcb hosting deploy dist -e <你的环境ID>"
